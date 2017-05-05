import crypt
import os
from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        if request.form['save'] == 'Save File':
            file_name = request.form['file_name']
            file_name_str = file_name + ".cfg"
            fi = open(file_name_str, 'w')
            ###Basic Configuration
            get_target = request.form.to_dict('target_architecture')
            target_architecture = get_target['target_architecture']
            fi.write("\n#platform=" + target_architecture + "")
            get_keyboard = request.form.to_dict('keyboard')
            keyboard = get_keyboard['keyboard']
            fi.write("\n# Keyboard layouts\nkeyboard '" + keyboard + "'")
            get_language = request.form.to_dict('language')
            language = get_language['language']
            fi.write("\n# System language\n" + language + "")
            get_timezone = request.form.to_dict('timezone')
            timezone = get_timezone['timezone']
            utc_check = "false"
            if request.form.get('utc_check'):
                utc_check = "true"
            if utc_check == "false":
                fi.write("\n# System timezone\n" + timezone + "")
            elif utc_check == "true":
                fi.write("\n# System timezone\n" + timezone + " --isUtc")
            print(timezone)
            rootpass = request.form['pass']
            rerootpass = request.form['repass']
            if rootpass == rerootpass:
                if request.form.get('basic_encrypt'):
                    print("basic encrypt **true**")
                    fi.write("\n# Root password\nrootpw --iscrypted " + crypt.crypt(rerootpass, crypt.mksalt(crypt.METHOD_MD5)))
                else:
                    print("basic encrypt **false**")
                    fi.write("\n# Root password\nrootpw --plaintext " + rerootpass)

            if request.form.get("reboot"):
                fi.write("\n# Reboot after installation\nreboot")
            else:
                fi.write("\n# Halt after installation\nhalt")

            if request.form.get("textmode"):
                fi.write("\n# Use text mode install\ntext")
            else:
                fi.write("\n# Use graphical install\ngraphical")
            ###Installation Configuration
            install_new_installation = request.form['install_new_installation']
            install_source = request.form['install_source']
            install_source_server = request.form['install_source_server']
            install_source_dict = request.form['install_source_dict']
            install_check_ftp = "false"
            install_ftp_user = request.form['install_ftp_user']
            install_ftp_pass = request.form['install_ftp_pass']
            if request.form.get("install_check_ftp"):
                install_check_ftp = "True"
            install_new_installation = install_new_installation.split("$$")
            fi.write("\n" + install_new_installation[0] + "\n" + install_new_installation[1])
            if install_source == "# Use CDROM installation media $$cdrom":
                cdrom = install_source.split("$$")
                fi.write("\n" + cdrom[0] + "\n" + cdrom[1])
            elif install_source == "# Use NFS installation media $$nfs":
                nfs = install_source.split("$$")
                fi.write(
                    "\n" + nfs[0] + "\n" + "nfs --server=" + install_source_server + " --dir=" + install_source_dict)
            elif install_source == "# Use network installation $$http":
                http = install_source.split("$$")
                fi.write(
                    "\n" + http[0] + "\nurl --url=\"http://" + install_source_server + "/" + install_source_dict + "\"")
            elif install_source == "# Use network installation $$ftp":
                ftp = install_source.split("$$")
                if install_check_ftp == "false":
                    fi.write("\n" + ftp[
                        0] + "\nurl --url=\"ftp://" + install_source_server + "/" + install_source_dict + "\"")
                if install_check_ftp == "True":
                    fi.write("\n" + ftp[
                        0] + "\nurl --url=\"ftp://" + install_ftp_user + ":" + install_ftp_pass + "@" + install_source_server + "/" + install_source_dict + "\"")
            elif install_source == "# Use hard drive installation media $$hard_drive":
                hard_drive = install_source.split("$$")
                fi.write("\n" + hard_drive[
                    0] + "\nharddrive --dir=" + install_source_server + " --partition=" + install_source_dict + "\"")
            ###Boot-Loader Configuration
            boot_line2 = "bootloader"
            bootloader_opt = request.form.get('Bootloader_Install')
            bootloader_parti = request.form.get('Bootloader_MBR')
            if bootloader_parti == "mbr":
                ins_opt = " --location=mbr"
            if bootloader_parti == "partition":
                ins_opt = " --location=partition"
            if bootloader_opt == "none":
                boot_line2 += " --location=none"
            if bootloader_opt == "upgrade":
                boot_line2 = boot_line2 + " --location=none --upgrade"
            if bootloader_opt == "bootloader --location":
                if request.form.get('Bootloader_GRUB'):
                    if request.form['Bootloader_Password'] == request.form['Bootloader_CPassword']:
                        if request.form.get("Bootloader_Encypt"):
                            boot_pass = ' --md5pass=\"' + crypt.crypt(request.form['Bootloader_Password'] + "\"", crypt.mksalt(crypt.METHOD_MD5))
                        else:
                            boot_pass = ' --password=\"' + request.form['Bootloader_Password'] + "\""
                        if request.form['Bootloader_kernel_para'] != "":
                            boot_line2 = boot_line2 + ' --append="' + request.form[
                                'Bootloader_kernel_para'] + '"' + ins_opt + boot_pass
                        else:
                            boot_line2 = boot_line2 + ins_opt + boot_pass
                else:
                    if request.form['Bootloader_kernel_para'] != "":
                        boot_line2 = boot_line2 + ' --append="' + request.form['Bootloader_kernel_para'] + '"' + ins_opt
                    else:
                        boot_line2 = boot_line2 + ins_opt
            fi.write("\n" + "# System bootloader configuration\n" + boot_line2)
            ###Partition Information
            if request.form.get("prt_check_zerombr"):
                fi.write("\n#Clear master boot record \nzerombr")
            if request.form.get("prt_check_rmallpart"):
                fi.write("\n#Partition Clearing Information\nclearpart --all")
                if request.form.get("prt_check_initlabel"):
                    fi.write(" --initlabel")
            else:
                fi.write("\n#Partition Clearing Information\nclearpart --none")
            if request.form.get("prt_check_autopart"):
                fi.write("\n#Disk partitioning information \nautopart")
            else:
                all_vg = request.form['prt_all_vg']
                all_lv = request.form['prt_all_lv']
                vg_list = all_vg.split("$$")
                lv_list = all_lv.split("$$")
                t1 = len(vg_list)
                t2 = len(lv_list)
                i = 0
                fi.write("\n#Disk partitioning information")
                for i in range(t1):
                    if i != 0:
                        vg_field = vg_list[i].split(" ")
                        vg_name = vg_field[1].split(":")
                        vg_disk = vg_field[2].split(":")
                        vg_size = vg_field[3].split(":")
                        vg_pesize = vg_field[4].split(":")
                        fi.write(
                            "\npart pv_" + vg_name[1] + ' --fstype="lvmpv" --ondisk=' + vg_disk[1] + " --size=" +
                            vg_size[
                                1])
                        fi.write("\nvolgroup " + vg_name[1] + " --pesize=" + vg_pesize[1] + " pv_" + vg_name[1])
                for i in range(t2):
                    if i != 0:
                        lv_field = lv_list[i].split(" ")
                        lv_mnt_pt = lv_field[1].split(":")
                        lv_vg = lv_field[2].split(":")
                        lv_name = lv_field[3].split(":")
                        lv_fst = lv_field[4].split(":")
                        lv_size = lv_field[5].split(":")
                        fi.write("\nlogvol " + lv_mnt_pt[1] + " --vgname=" + lv_vg[1] + " --name=" + lv_name[
                            1] + " --fstype=" + lv_fst[1] + " --size=" + lv_size[1])
                        if (len(lv_field) == 8):
                            lv_maxsize = lv_field[7].split(":")
                            fi.write(" --grow --maxsize=" + lv_maxsize[1])
            ###Network Configuration
            if request.form.get("net_check_default_network"):
                fi.write("\n#No network device information")
            else:
                all_dev = request.form['net_all_devices']
                dev_list = all_dev.split("$$")
                t1 = len(dev_list)
                i = 0
                fi.write("\n#Network device information")
                for i in range(t1):
                    if i != 0:
                        dev_field = dev_list[i].split(" ")
                        if len(dev_field) == 7:
                            dev_name = dev_field[1].split(':')
                            dev_protocol = dev_field[2].split(':')
                            dev_ip = dev_field[3].split(':')
                            dev_netmask = dev_field[4].split(':')
                            dev_gateway = dev_field[5].split(':')
                            dev_nameserver = dev_field[6].split(':')
                            fi.write(
                                "\nnetwork --device=" + dev_name[1] + ' --bootproto=' + dev_protocol[1] + ' --ip=' +
                                dev_ip[1] + " --netmask=" + dev_netmask[1] + " --gateway=" + dev_gateway[
                                    1] + " --nameserver=" + dev_nameserver[1])
                        else:
                            dev_name = dev_field[1].split(':')
                            dev_protocol = dev_field[2].split(':')
                            fi.write("\nnetwork --device=" + dev_name[1] + ' --bootproto=' + dev_protocol[1])
            ###Authentication Configuration
            auth_line2 = "auth"
            if request.form.get("auth_shadow_pass"):
                auth_line2 += " --useshadow"
            auth_security_algo = request.form['auth_security_algo']
            auth_line2 = auth_line2 + auth_security_algo
            if request.form.get("auth_finger_reader"):
                auth_line2 += " --enablefingerprint"
            if request.form.get("auth_enable_nis"):
                auth_line2 += " --enablenis --nisdomain=" + request.form['auth_nis_domain']
                if request.form.get("auth_broadcast_nis"):
                    pass
                else:
                    auth_line2 += " --nisserver=" + request.form['auth_nis_server']
            if request.form.get("auth_enable_ldap"):
                auth_line2 += " --enableldap --enableldapauth --ldapserver=" + request.form[
                    'auth_ldap_server'] + " --ldapbasedn=" + request.form['auth_ldap_base']
                if request.form.get("auth_ldap_certificate"):
                    auth_line2 += " --ldaploadcacert=" + request.form['auth_ldap_cert_url']
            if request.form.get("auth_enable_krb5"):
                auth_line2 += " --enablekrb5 --krb5realm=" + request.form['auth_krb5_realm'] + " --krb5kdc=" + \
                              request.form['auth_kerberos_domain'] + " --krb5adminserver=" + request.form[
                                  'auth_krb5_master']
            if request.form.get("auth_enable_smb"):
                auth_line2 += " --enablesmbauth --smbservers=" + request.form['auth_smb_server'] + " --smbworkgroup=" + \
                              request.form['auth_smb_workgrp']
            if request.form.get("auth_switch_cache"):
                auth_line2 += " --enablecache"
            fi.write("\n" + "# System authorization information\n" + auth_line2)
            ###firewall Configuration
            firewall_selinux_state = request.form['firewall_selinux_state']
            firewall_sequrity_level = request.form['firewall_sequrity_level']
            firewall_other_port = request.form['firewall_other_port']
            fi.write("\n" + "# SELinux configuration" + "\n" + firewall_selinux_state)
            if firewall_sequrity_level == "Disable_firewall":
                fi.write("\n" + "# Firewall configuration" + "\n" + "firewall --disabled")
            if firewall_sequrity_level == "Enable_firewall":
                fi.write("\n" + "# Firewall configuration" + "\n" + "firewall --enabled")
                if request.form.get("firewall_http_service"):
                    fi.write(" " + request.form['firewall_http_service'])
                if request.form.get("firewall_ftp_service"):
                    fi.write(" " + request.form['firewall_ftp_service'])
                if request.form.get("firewall_ssh_service"):
                    fi.write(" " + request.form['firewall_ssh_service'])
                if request.form.get("firewall_telnet_service"):
                    fi.write(" " + request.form['firewall_telnet_service'])
                if request.form.get("firewall_mail_service"):
                    fi.write(" " + request.form['firewall_mail_service'])
                if firewall_other_port != "":
                    fi.write(" --port=" + firewall_other_port)
            ###Display Configuration
            check_value = request.form.to_dict('display_checkbox')
            if request.form.get("display_checkbox"):
                print("checked")
                first_boot = check_value['first-boot']
                if first_boot == 'Enabled':
                    print("enable")
                    fi.write("\n# Run the Setup Agent on first boot\nfirstboot --enable")
                elif first_boot == 'Disabled':
                    print("disable")
                    fi.write("\n# Run the Setup Agent on first boot\nfirstboot --disable")
                elif first_boot == 'Reconfigure':
                    print("reconfigure")
                    fi.write("\n# Run the Setup Agent on first boot\nfirstboot --reconfig")
            else:
                print("uncheck")
                fi.write(
                    "\n# Run the Setup Agent on first boot\nfirstboot --reconfig\n# Do not configure the X Window System\nskipx")
            ###Package Configuration
            pkg_gnome_package = {request.form.get("pkg_group_epiphany"): "epiphany",
                                 request.form.get("pkg_group_gnome-games"): "gnome-games",
                                 request.form.get("pkg_group_gnome-desktop"): "gnome-desktop"}
            pkg_kde_package = {request.form.get("pkg_group_kde-desktop"): "kde-desktop",
                               request.form.get("pkg_group_kde-apps"): "kde-apps",
                               request.form.get("pkg_group_kde-education"): "kde-education",
                               request.form.get("pkg_group_kde-media"): "kde-media",
                               request.form.get("pkg_group_kde-office"): "kde-office",
                               request.form.get("pkg_group_kde-telepathy"): "kde-telepathy"}
            pkg_xfce_package = {request.form.get("pkg_group_xfce-apps"): "xfce-apps",
                                request.form.get("pkg_group_xfce-desktop"): "xfce-desktop",
                                request.form.get("pkg_group_xfce-extra-plugins"): "xfce-extra-plugins",
                                request.form.get("pkg_group_xfce-media"): "xfce-media",
                                request.form.get("pkg_group_xfce-office"): "xfce-office"}
            pkg_appli_package = {request.form.get("pkg_group_audio"): "audio",
                                 request.form.get("pkg_group_authoring-and-publishing"): "authoring-and-publishing",
                                 request.form.get("pkg_group_design-suite"): "design-suite",
                                 request.form.get("pkg_group_editors"): "editors",
                                 request.form.get("pkg_group_education"): "education",
                                 request.form.get("pkg_group_engineering-and-scientific"): "engineering-and-scientific",
                                 request.form.get("pkg_group_firefox"): "firefox",
                                 request.form.get("pkg_group_font-design"): "font-design",
                                 request.form.get("pkg_group_games"): "games",
                                 request.form.get("pkg_group_graphical-internet"): "graphical-internet",
                                 request.form.get("pkg_group_graphics"): "graphics",
                                 request.form.get("pkg_group_libreoffice"): "libreoffice",
                                 request.form.get("pkg_group_medical"): "medical",
                                 request.form.get("pkg_group_office"): "office",
                                 request.form.get("pkg_group_sound-and-video"): "sound-and-video",
                                 request.form.get("pkg_group_text-internet"): "text-internet"}
            pkg_lxde_package = {request.form.get("pkg_group_lxde-apps"): "lxde-apps",
                                request.form.get("pkg_group_lxde-desktop"): "lxde-desktop",
                                request.form.get("pkg_group_lxde-office"): "lxde-office",
                                request.form.get("pkg_group_lxde-media"): "lxde-media"}
            pkg_lxqt_package = {request.form.get("pkg_group_lxqt-apps"): "lxqt-apps",
                                request.form.get("pkg_group_lxqt-desktop"): "lxqt-desktop",
                                request.form.get("pkg_group_lxqt-office"): "lxqt-office",
                                request.form.get("pkg_group_lxqt-media"): "lxqt-media"}
            pkg_chinn_package = {request.form.get("pkg_group_cinnamon-desktop"): "cinnamon-desktop"}
            pkg_sugar_package = {request.form.get("pkg_group_sugar-apps"): "sugar-apps",
                                 request.form.get("pkg_group_sugar-desktop"): "sugar-desktop"}
            pkg_uncate_package = {request.form.get("pkg_group_3d-printing"): "3d-printing",
                                  request.form.get("pkg_group_anaconda-tools"): "anaconda-tools",
                                  request.form.get("pkg_group_ansible-node"): "ansible-node",
                                  request.form.get("pkg_group_arabic-support"): "arabic-support",
                                  request.form.get("pkg_group_arm-tools"): "arm-tools",
                                  request.form.get("pkg_group_assamese-support"): "assamese-support",
                                  request.form.get("pkg_group_base-x"): "base-x",
                                  request.form.get("pkg_group_basic-desktop"): "basic-desktop",
                                  request.form.get("pkg_group_bengali-support"): "bengali-support",
                                  request.form.get("pkg_group_bhutanese-support"): "bhutanese-support",
                                  request.form.get("pkg_group_bodo-support"): "bodo-support",
                                  request.form.get("pkg_group_buildsys-build"): "buildsys-build",
                                  request.form.get("pkg_group_burmese-support"): "burmese-support",
                                  request.form.get("pkg_group_cloud-management"): "cloud-management",
                                  request.form.get("pkg_group_cloud-server"): "cloud-server",
                                  request.form.get("pkg_group_container-management"): "container-management",
                                  request.form.get("pkg_group_core"): "core",
                                  request.form.get("pkg_group_critical-path-apps"): "critical-path-apps",
                                  request.form.get("pkg_group_critical-path-base"): "critical-path-base",
                                  request.form.get("pkg_group_critical-path-gnome"): "critical-path-gnome",
                                  request.form.get("pkg_group_critical-path-hawaii"): "critical-path-hawaii",
                                  request.form.get("pkg_group_critical-path-kde"): "critical-path-kde",
                                  request.form.get("pkg_group_critical-path-lxde"): "critical-path-lxde",
                                  request.form.get("pkg_group_critical-path-lxqt"): "critical-path-lxqt",
                                  request.form.get("pkg_group_critical-path-xfce"): "critical-path-xfce",
                                  request.form.get("pkg_group_d-development"): "d-development",
                                  request.form.get("pkg_group_dogri-support"): "dogri-support",
                                  request.form.get("pkg_group_domain-client"): "domain-client",
                                  request.form.get("pkg_group_enlightenment-desktop"): "enlightenment-desktop",
                                  request.form.get("pkg_group_ethiopic-support"): "ethiopic-support",
                                  request.form.get("pkg_group_finnish-support"): "finnish-support",
                                  request.form.get("pkg_group_georgian-support"): "georgian-support",
                                  request.form.get("pkg_group_greek-support"): "greek-support",
                                  request.form.get("pkg_group_guest-agents"): "guest-agents",
                                  request.form.get("pkg_group_guest-desktop-agents"): "guest-desktop-agents",
                                  request.form.get("pkg_group_gujarati-support"): "gujarati-support",
                                  request.form.get("pkg_group_headless-management"): "headless-management",
                                  request.form.get("pkg_group_hebrew-support"): "hebrew-support",
                                  request.form.get("pkg_group_hindi-support"): "hindi-support",
                                  request.form.get("pkg_group_japanese-support"): "japanese-support",
                                  request.form.get("pkg_group_kannada-support"): "kannada-support",
                                  request.form.get("pkg_group_kashmiri-support"): "kashmiri-support",
                                  request.form.get("pkg_group_khmer-support"): "khmer-support",
                                  request.form.get("pkg_group_konkani-support"): "konkani-support",
                                  request.form.get("pkg_group_korean-support"): "korean-support",
                                  request.form.get("pkg_group_kurdish-support"): "kurdish-support",
                                  request.form.get("pkg_group_lepcha-support"): "lepcha-support",
                                  request.form.get("pkg_group_livecd-tools"): "livecd-tools",
                                  request.form.get("pkg_group_maithili-support"): "maithili-support",
                                  request.form.get("pkg_group_malayalam-support"): "malayalam-support",
                                  request.form.get("pkg_group_manipuri-support"): "manipuri-support",
                                  request.form.get("pkg_group_marathi-support"): "marathi-support",
                                  request.form.get("pkg_group_multimedia"): "multimedia",
                                  request.form.get("pkg_group_nepali-support"): "nepali-support",
                                  request.form.get("pkg_group_odia-support"): "odia-support",
                                  request.form.get("pkg_group_persian-support"): "persian-support",
                                  request.form.get("pkg_group_platform-vmware"): "platform-vmware",
                                  request.form.get("pkg_group_punjabi-support"): "punjabi-support",
                                  request.form.get("pkg_group_russian-support"): "russian-support",
                                  request.form.get("pkg_group_sanskrit-support"): "sanskrit-support",
                                  request.form.get("pkg_group_santali-support"): "santali-support",
                                  request.form.get("pkg_group_security-lab"): "security-lab",
                                  request.form.get("pkg_group_server-hardware-support"): "server-hardware-support",
                                  request.form.get("pkg_group_server-product"): "server-product",
                                  request.form.get(
                                      "pkg_group_simplified-chinese-support"): "simplified-chinese-support",
                                  request.form.get("pkg_group_sindhi-support"): "sindhi-support",
                                  request.form.get("pkg_group_sinhala-support"): "sinhala-support",
                                  request.form.get("pkg_group_tamil-support"): "tamil-support",
                                  request.form.get("pkg_group_telugu-support"): "telugu-support",
                                  request.form.get("pkg_group_thai-support"): "thai-support",
                                  request.form.get("pkg_group_tibetan-support"): "tibetan-support",
                                  request.form.get(
                                      "pkg_group_traditional-chinese-support"): "traditional-chinese-support",
                                  request.form.get("pkg_group_urdu-support"): "urdu-support",
                                  request.form.get("pkg_group_vagrant"): "vagrant",
                                  request.form.get("pkg_group_virtualization-headless"): "virtualization-headless",
                                  request.form.get("pkg_group_window-managers"): "window-managers",
                                  request.form.get(
                                      "pkg_group_workstation-ostree-support"): "workstation-ostree-support",
                                  request.form.get("pkg_group_workstation-product"): "workstation-product",
                                  request.form.get("pkg_group_xmonad"): "xmonad",
                                  request.form.get("pkg_group_xmonad-mate"): "xmonad-mate",
                                  request.form.get("pkg_group_yiddish-support"): "yiddish-support"}
            pkg_base_system_package = {request.form.get("pkg_group_admin-tools"): "admin-tools",
                                       request.form.get("pkg_group_networkmanager-submodules"): "networkmanager-submodules",
                                       request.form.get("pkg_group_dial-up"): "dial-up",
                                       request.form.get("pkg_group_fonts"): "fonts",
                                       request.form.get("pkg_group_hardware-support"): "hardware-support",
                                       request.form.get("pkg_group_input-methods"): "input-methods",
                                       request.form.get("pkg_group_java"): "java",
                                       request.form.get("pkg_group_legacy-fonts"): "legacy-fonts",
                                       request.form.get("pkg_group_legacy-software-support"): "legacy-software-support",
                                       request.form.get("pkg_group_standard"): "standard",
                                       request.form.get("pkg_group_system-tools"): "system-tools",
                                       request.form.get("pkg_group_virtualization"): "virtualization"}
            pkg_content_package = {request.form.get("pkg_group_books"): "books"}
            #####mate
            pkg_mate_package = {request.form.get("pkg_group_mate-desktop"): "mate-desktop",
                                request.form.get("pkg_group_mate-applications"): "mate-applications",
                                request.form.get("pkg_group_mate-compiz"): "mate-compiz"
                                }
            ####hawaii
            pkg_hawaii_package = {request.form.get("pkg_group_hawaii-apps"): "hawaii-apps",
                                  request.form.get("pkg_group_hawaii-desktop"): "hawaii-desktop",
                                  request.form.get("pkg_group_hawaii-office"): "hawaii-office",
                                  request.form.get("pkg_group_hawaii-media"): "hawaii-media"
                                  }
            #####Server
            pkg_ser_package = {request.form.get("pkg_group_web-server"): "web-server",
                               request.form.get("pkg_group_cloud-infrastructure"): "cloud-infrastructure",
                               request.form.get("pkg_group_dns-server"): "dns-server",
                               request.form.get("pkg_group_directory-server"): "directory-server",
                               request.form.get("pkg_group_dogtag"): "dogtag",
                               request.form.get("pkg_group_ftp-server"): "ftp-server",
                               request.form.get("pkg_group_freeipa-server"): "freeipa-server",
                               request.form.get("pkg_group_haproxy"): "haproxy",
                               request.form.get("pkg_group_ha"): "ha",
                               request.form.get("pkg_group_javaenterprise"): "javaenterprise",
                               request.form.get("pkg_group_legacy-network-server"): "legacy-network-server",
                               request.form.get("pkg_group_load-balancer"): "load-balancer",
                               request.form.get("pkg_group_mail-server"): "mail-server",
                               request.form.get("pkg_group_mysql"): "mysql",
                               request.form.get("pkg_group_mongodb"): "mongodb",
                               request.form.get("pkg_group_network-server"): "network-server",
                               request.form.get("pkg_group_news-server"): "news-server",
                               request.form.get("pkg_group_php"): "php",
                               request.form.get("pkg_group_perl-web"): "perl-web",
                               request.form.get("pkg_group_sql-server"): "sql-server",
                               request.form.get("pkg_group_printing"): "printing",
                               request.form.get("pkg_group_python-web"): "python-web",
                               request.form.get("pkg_group_rubyonrails"): "rubyonrails",
                               request.form.get("pkg_group_server-cfg"): "server-cfg",
                               request.form.get("pkg_group_tomcat"): "tomcat",
                               request.form.get("pkg_group_virtulization"): "virtulization",
                               request.form.get("pkg_group_smb-server"): "smb-server"}
            pkg_dev_package = {request.form.get("pkg_group_web-server"): "web-server",
                               request.form.get("pkg_group_c-development"): "c-development",
                               request.form.get("pkg_group_design-suite"): "design-suite",
                               request.form.get("pkg_group_development-libs"): "development-libs",
                               request.form.get("pkg_group_development-tools"): "development-tools",
                               request.form.get("pkg_group_electronic-lab"): "electronic-lab",
                               request.form.get("pkg_group_eclips"): "eclips",
                               request.form.get("pkg_group_fedora-packager"): "fedora-packager",
                               request.form.get("pkg_group_font-design"): "font-design",
                               request.form.get("pkg_group_gnome-software-development"): "gnome-software-development",
                               request.form.get("pkg_group_haskell"): "haskell",
                               request.form.get("pkg_group_javaenterprise"): "javaenterprise",
                               request.form.get("pkg_group_java-development"): "java-development",
                               request.form.get("pkg_group_kde-software-development"): "kde-software-development",
                               request.form.get("pkg_group_kf5-software-development"): "kf5-software-development",
                               request.form.get("pkg_group_legacy-software-development"): "legacy-software-development",
                               request.form.get("pkg_group_libreoffice-development"): "libreoffice-development",
                               request.form.get("pkg_group_mysql"): "mysql",
                               request.form.get("pkg_group_milkymist"): "milkymist",
                               request.form.get("pkg_group_mingw32"): "mingw32",
                               request.form.get("pkg_group_mongodb"): "mongodb",
                               request.form.get("pkg_group_ocaml"): "ocaml",
                               request.form.get("pkg_group_php"): "php",
                               request.form.get("pkg_group_perl"): "perl",
                               request.form.get("pkg_group_perl-web"): "perl-web",
                               request.form.get("pkg_group_sql-server"): "sql-server",
                               request.form.get("pkg_group_python-web"): "python-web",
                               request.form.get("pkg_group_rpm-development-tools"): "rpm-development-tools",
                               request.form.get("pkg_group_robotics-suite"): "robotics-suite",
                               request.form.get("pkg_group_ruby"): "ruby",
                               request.form.get("pkg_group_rubyonrails"): "rubyonrails",
                               request.form.get("pkg_group_virtualization"): "virtualization",
                               request.form.get("pkg_group_x-software-development"): "x-software-development",
                               request.form.get("pkg_group_xfce-software-development"): "xfce-software-development",
                               request.form.get("pkg_group_"): ""}
            if request.form.get("pkg_enb_chk"):
                fi.write("\n\n%packages\n")
                if request.form.get("pkg_gnome"):
                    for pkg_name in pkg_gnome_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_gnome_package[pkg_name])
                if request.form.get("pkg_kde"):
                    for pkg_name in pkg_kde_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_kde_package[pkg_name])
                if request.form.get("pkg_xfce"):
                    for pkg_name in pkg_xfce_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_xfce_package[pkg_name])
                if request.form.get("pkg_appli"):
                    for pkg_name in pkg_appli_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_appli_package[pkg_name])
                if request.form.get("pkg_lxde"):
                    for pkg_name in pkg_lxde_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_lxde_package[pkg_name])
                if request.form.get("pkg_lxqt"):
                    for pkg_name in pkg_lxqt_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_lxqt_package[pkg_name])
                if request.form.get("pkg_chinn"):
                    for pkg_name in pkg_chinn_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_chinn_package[pkg_name])
                if request.form.get("pkg_mate"):  ######mate
                    for pkg_name in pkg_mate_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_mate_package[pkg_name])
                if request.form.get("pkg_hawaii"):  #####hawaii
                    for pkg_name in pkg_hawaii_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_hawaii_package[pkg_name])
                if request.form.get("pkg_server"):  #####server
                    for pkg_name in pkg_ser_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_ser_package[pkg_name])
                if request.form.get("pkg_sugar"):
                    for pkg_name in pkg_sugar_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_sugar_package[pkg_name])
                # Development
                if request.form.get("pkg_dev"):
                    for pkg_name in pkg_dev_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_dev_package[pkg_name])
                # Base System
                if request.form.get("pkg_base"):
                    for pkg_name in pkg_base_system_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_base_system_package[pkg_name])
                # Content
                if request.form.get("pkg_cont"):
                    for pkg_name in pkg_content_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_content_package[pkg_name])
                if request.form.get("pkg_uncat"):
                    for pkg_name in pkg_uncate_package:
                        if pkg_name:
                            fi.write("\n@" + pkg_uncate_package[pkg_name])
                fi.write("\n\n%end\n")
            ###Pre Configuration
            pre_interpreter_name = request.form['pre_interpreter_name']
            pre_interpreter_scr = request.form['pre_interpreter_scr']
            if request.form.get("pre_interpreter_enble"):
                fi.write("\n\n\n\n" + "%pre")
                if request.form.get("pre_inter_allow"):
                    fi.write(" --interpreter=" + pre_interpreter_name)
                fi.write("\n" + pre_interpreter_scr)
                fi.write("\n%end")
            ###Post Configuration
            post_interpreter_name = request.form['post_interpreter_name']
            post_interpreter_scr = request.form['post_interpreter_scr']
            if request.form.get("post_interpreter_enble"):
                fi.write("\n\n\n\n" + "%post")
                if request.form.get("post_inter_allow"):
                    fi.write(" --interpreter=" + post_interpreter_name)
                if request.form.get("post_nochroot_allow"):
                    fi.write(" --nochroot")
                fi.write("\n" + post_interpreter_scr)
                fi.write("\n%end")
            ##########################################################
            fi.close()
            #return '<a href="#" id="down1"><input type="button" align="left" class="btn btn-default" id="Download" name="Download" value="Download"/></a><script>$("#Download").click(function() {document.getElementById("down1").href ="http://127.0.0.1:5000/'+file_name_str+'";document.getElementById("down1").download ='+file_name_str+';});</script>'
            #return '<a href="templates/'+file_name+'.cfg" id="down1" download>Download</a>'
            return render_template('index.html')
    if request.method == 'GET':
        return render_template('index.html')


@app.route('/help.html', methods=['POST', 'GET'])
def Help():
    return render_template('help.html')


@app.route('/Customise.html', methods=['POST', 'GET'])
def Customise():
    return render_template('Customise.html')


@app.route('/Setup.html', methods=['POST', 'GET'])
def Setup():
    if request.method == 'POST':
        if request.form['submit'] == 'FTP Start':
            os.system("dnf -y install vsftpd")
            os.system("systemctl restart vsftpd")
            os.system("systemctl enable vsftpd")
            os.system("firewall-cmd --permanent --add-port=21/tcp")
            os.system("firewall-cmd --reload")
            return "<script> alert('FTP configured');  window.location = 'Setup.html';</script>"
        elif request.form['submit'] == 'FTP Stop':
            os.system("/sbin/service vsftpd stop")
            return "<script> alert('FTP service Stop');  window.location = 'Setup.html';</script>"
        elif request.form['submit'] == 'Upload File by_FTP':
            ftp_file = request.form['ftp_file']
            ftp_upload_cmd = "cp " + ftp_file + " /var/ftp/pub/cfg_files/"
            os.system(ftp_upload_cmd)
            os.system("restorecon /var/ftp/pub/cfg_files/*")
            return "<script> alert('File Uploaded on FTP server'); window.location = 'Setup.html';</script>"
        elif request.form['submit'] == 'NFS Start':
            os.system("dnf install -y nfs*")
            os.system("mkdir  /var/cfg_files")
            fi1 = open("/etc/exports", 'w')
            fi1.write("/var/cfg_files    *(rw,sync)")
            fi1.close()
            os.system("systemctl restart nfs-server.service")
            os.system("systemctl enable nfs-server.service")
            os.system("firewall-cmd --permanent --add-service=nfs")
            os.system("firewall-cmd --reload")
            return "<script> alert('NFS configured');  window.location = 'Setup.html';</script>"
        elif request.form['submit'] == 'NFS Stop':
            os.system("/sbin/service nfs stop")
            return "<script> alert('NFS service Stop');  window.location = 'Setup.html';</script>"
        elif request.form['submit'] == 'Upload File by_NFS':
            nfs_file = request.form['nfs_file']
            nfs_upload_cmd = "cp " + nfs_file + " /var/cfg_files/"
            os.system(nfs_upload_cmd)
            return "<script> alert('File Uploaded');  window.location = 'Setup.html';</script>"
        elif request.form['submit'] == 'HTTP Start':
            os.system("dnf -y install httpd")
            os.system("touch /var/www/html/index.html")
            os.system("systemctl restart httpd.service")
            os.system("systemctl enable httpd.service")
            os.system("firewall-cmd --permanent --add-service=http")
            os.system("firewall-cmd --reload")
            return "<script> alert('HTTP server configured'); window.location = 'Setup.html';</script>"
        elif request.form['submit'] == 'Upload File by_HTTP':
            http_file = request.form['http_file']
            http_upload_cmd = "cp " + http_file + " /var/www/html/"
            os.system(http_upload_cmd)
            os.system("restorecon /var/www/html/* -R")
            return "<script> alert('File Uploaded on HTTP server'); window.location = 'Setup.html';</script>"
    return render_template('Setup.html')


@app.route('/Credits.html', methods=['POST', 'GET'])
def Credits():
    return render_template('Credits.html')


if __name__ == '__main__':
    app.run(debug=True)
