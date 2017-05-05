$(document).ready(function() {
	var flag_preview=0;
    var vg_last_lines=0;
    var lv_last_lines=0;
    var autopart_flag=0;
    var last_lines=0;
    var flag_preview_net=0;
    $("#preview_all").click(function() {
        $("#wrapper").toggleClass("toggled");

        // Get the modal
        var modal = document.getElementById('myModal');

        // Get the button that opens the modal
        var btn = document.getElementById("preview_all");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks the button, open the modal 
        /*btn.onclick = function() */
        {
            modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

       // basic and display configuration preview starts here --- (Just copy paste 14/04/2017 YVT)
	//password still remain ask to ankit

        var lang = document.getElementById("language").value;
        var keyboard = document.getElementById("keyboard").value;
        var timezone = document.getElementById("timezone").value;
	var pass = document.getElementById("repass").value;
	var target = document.getElementById("target_architecture").value;
	var firstboot = document.getElementById("first-boot").value;

	if($("#utc_check").is(':checked'))
	{
		utc = "# System timezone<br/>timezone "+timezone+" --utc";
	}
	else
	{
		utc = "# System timezone<br/>timezone "+timezone;
	}

	if($("#reboot").is(':checked'))
	{
		reboot = "# Reboot after installation<br/>reboot";
	}
	else
	{
		reboot = "# Halt after installation<br/>halt"
	}

	if($("#textmode").is(':checked'))
	{
		textmode = "# Use text mode install<br/>text";
	}
	else
	{
		textmode = "# Use text mode install<br/>text"
	}

	if($("#display_checkbox").is(':checked'))
	{
		if(firstboot=="Disabled"){
			display="# Run the Setup Agent on first boot<br/>firstboot --disable";
		}
		else if(firstboot=="Enabled"){
			display="# Run the Setup Agent on first boot<br/>firstboot --enable";
		}
		else if(firstboot=="Reconfigure"){
			display="# Run the Setup Agent on first boot<br/>firstboot --reconfig";
		}
		else{
			alert("Please try again !");
		}
	}

	$("#basic_conf1").html("#platform="+target);
	$("#basic_conf2").html("# Keyboard layouts<br/>"+keyboard);
	$("#basic_conf3").html("## System language <br/>"+lang);
	$("#basic_conf4").html(reboot);
	$("#basic_conf5").html(utc);
	$("#basic_conf6").html(textmode);
	$("#display_conf1").html(display);

	// basic and display configuration preview ends here --
        //file logic (installation)
        var install_ser = document.getElementById('install_source_server').value;
        var install_dict = document.getElementById('install_source_dict').value;
        var install_user = document.getElementById('install_ftp_user').value;
        var install_pass = document.getElementById('install_ftp_pass').value;

        if (document.getElementById("install_new_install").checked == true) {
            var file_installation_line1 = "# Install OS instead of upgrade";
            var file_installation_line2 = "install";
        }
        if (document.getElementById("install_upgrade_install").checked == true) {
            var file_installation_line1 = "# Upgrade existing installation";
            var file_installation_line2 = "upgrade";
        }
        if (document.getElementById("install_cd_rom").checked == true) {
            var file_installation_line3 = "# Use CDROM installation media";
            var file_installation_line4 = "cdrom";
        }
        if (document.getElementById("install_nfs").checked == true) {
            var file_installation_line3 = "# Use NFS installation media";
            var file_installation_line4 = "nfs --server=" + install_ser + " --dir=" +
                install_dict;
        }
        if (document.getElementById("install_http").checked == true) {
            var file_installation_line3 = "# Use network installation";
            var file_installation_line4 = "url --url=\"http://" + install_ser + "/" +
                install_dict + "\"";
        }
        if (document.getElementById("install_ftp").checked == true) {
            var file_installation_line3 = "# Use network installation";
            if (document.getElementById("install_check_ftp").checked == true) {
                var file_installation_line4 = "url --url=\"ftp://" + install_user + ":" +
                    install_pass + "@" + install_ser + "/" + install_dict + "\"";
            }
            else {
                var file_installation_line4 = "url --url=\"ftp://" + install_ser + "/" +
                    install_dict + "\"";
            }
        }
        if (document.getElementById("install_hard_drive").checked == true) {
            var file_installation_line3 = "# Use hard drive installation media";
            var file_installation_line4 = "harddrive --dir=" + install_ser + " --partition=" +
                install_dict;
        }
        $("#file_installation_line1").text(file_installation_line1);
        $("#file_installation_line2").text(file_installation_line2);
        $("#file_installation_line3").text(file_installation_line3);
        $("#file_installation_line4").text(file_installation_line4);
        //file logic (Boot-Loader Configuration)
        var boot_line2="bootloader";
        var kernel_para=document.getElementById('Bootloader_kernel_para').value;
        var ins_opt;

        var pass=document.getElementById('Bootloader_Password').value;
        var cpass=document.getElementById('Bootloader_CPassword').value;
        var boot_Epass;

	if(document.getElementById('mbp1').checked)
          {
            ins_opt= " --location=mbr";

	  }
       if(document.getElementById('mbp2').checked)
          {
            ins_opt= " --location=partition";

	  }
	if (document.getElementById('b2').checked)

		{
		 boot_line2 = boot_line2 + " --location=none";

                }
        if (document.getElementById('b3').checked)

		{
		 boot_line2 = boot_line2 + " --location=none --upgrade";

                }



       if (document.getElementById('b1').checked)

	{
                  if(document.getElementById('Bootloader_GRUB').checked ==true)
                 	  {
			   if(document.getElementById('Bootloader_Encypt').checked==true)
          			{
					var md5p=$.md5(pass);
        				var md5cp=$.md5(cpass);

	             			if(pass == cpass)
					{
			 		    boot_Epass = ' --md5pass="'+ md5p + '"';


					}
                                        else
					{
					 // document.getElementById("msg").innerHTML = "Password is incorect";
					boot_Epass = " Password is not Correct";
					}
          			}

       			    if(document.getElementById('Bootloader_Encypt').checked==false)

				{
					if(pass == cpass)
                			{
		 			boot_Epass = ' --password="' + pass + '"';
					}
					else
					{
					 // document.getElementById("msg").innerHTML = "Password is incorect";
					boot_Epass = " Password is not Correct";
					}
			        }

			if(kernel_para !="")
                                   {
			             boot_line2 = boot_line2 + ' --append="'+ kernel_para + '"'+ ins_opt + boot_Epass;

                                    }
                            else
                                   {
			              boot_line2 = boot_line2 + ins_opt + boot_Epass;
		                    }

        }
        if(document.getElementById('Bootloader_GRUB').checked == false)
		{
		     if (kernel_para !="")
                        {
			 boot_line2 = boot_line2 + ' --append="'+ kernel_para + '"'+ ins_opt;

                        }
                        else
                          {
			   boot_line2 = boot_line2 + ins_opt;
		         }
		}

  }
		$("#Bootloader_line2").text(boot_line2);
        //file logic (Partition Information)
        if(flag_preview>0)
        {
            flag_preview=0;
            for(i=1;i<vg_last_lines;i++)
            {
                $("#part_line3_"+i).remove();
                $("#part_line3_"+i+"_1").remove();
            }
            for(i=1,i3=vg_last_lines;i<lv_last_lines;i++,i3++)
            {
                $('#part_line3_'+i3+'_1').remove();
            }
        }
        flag_preview++;

        // Partition file Logic.
        if(document.getElementById("prt_check_zerombr").checked == true)
        {
            $("#part_line1").text("#Clear master boot record");
            $("#part_line1_1").text("zerombr");
        }
        else
        {
            $("#part_line1").text("#Do not Clear master boot record");
            $("#part_line1_1").text(" ");
        }

        if(document.getElementById("prt_check_rmallpart").checked == true)
        {
            if(document.getElementById("prt_check_initlabel").checked == true)
            {
                $("#part_line2").text("#Partition Clearing Information");
                $("#part_line2_1").text("clearpart --all --initlabel");
            }
            else
            {
                $("#part_line2").text("#Partition Clearing Information");
                $("#part_line2_1").text("clearpart --all");
            }
        }
        else
        {
            $("#part_line2").text("#Partition Clearing Information");
            $("#part_line2_1").text("clearpart --none");
        }

        if(document.getElementById("prt_check_autopart").checked == true)
        {
            if(autopart_flag>0)
            {
                $("#part_line3_1").remove();
                autopart_flag=0;
            }
            $("#part_line3_0").text("#Disk partitioning information");
            $("#part_line3_0").clone().attr('id','part_line3_1').insertAfter('#part_line3_0');
            $("#part_line3_1").text("autopart");
            autopart_flag++;
        }
        else
        {
            if(autopart_flag>0)
            {
                $("#part_line3_1").remove();
                autopart_flag=0;
            }
            // logic to get vg and lv
            all_vg = $('#prt_all_vg').val();
            all_lv = $('#prt_all_lv').val();
                vg_list = all_vg.split("$$");
                lv_list = all_lv.split("$$");
                t1=vg_list.length;
                t2=lv_list.length;

                vg_last_lines=t1;
                lv_last_lines=t2;

                $("#part_line3_0").text("#Disk partitioning information");
                for(i=1,i2=0;i<t1;i++,i2++)
                {
                    vg_field=vg_list[i].split(" ");
                    vg_name=vg_field[1].split(":");
                    vg_disk=vg_field[2].split(":");
                    vg_size=vg_field[3].split(":");
                    vg_pesize=vg_field[4].split(":");
                    $("#part_line3_0").clone().attr('id','part_line3_'+i).insertAfter('#part_line3_'+i2);
                    $("#part_line3_"+i).text("part pv_"+vg_name[1]+' --fstype="lvmpv" --ondisk='+vg_disk[1]+" --size="+vg_size[1]);
                    $("#part_line3_0").clone().attr('id','part_line3_'+i+"_1").insertAfter('#part_line3_'+i);
                    $("#part_line3_"+i+"_1").text("volgroup "+vg_name[1]+" --pesize="+vg_pesize[1]+" pv_"+vg_name[1]);
                }

                for(i=1,i2=t1-1,i3=t1;i<t2;i++,i2++,i3++)
                {
                    lv_field = lv_list[i].split(" ");
                    lv_mnt_pt = lv_field[1].split(":");
                    lv_vg = lv_field[2].split(":");
                    lv_name = lv_field[3].split(":");
                    lv_fst = lv_field[4].split(":");
                    lv_size = lv_field[5].split(":");

                    $("#part_line3_0").clone().attr('id','part_line3_'+i3+'_1').insertAfter('#part_line3_'+i2+'_1');

                    if (lv_field.length == 8)
                    {
                        lv_maxsize = lv_field[7].split(":");
                        $('#part_line3_'+i3+'_1').text("logvol "+lv_mnt_pt[1]+" --vgname="+lv_vg[1]+" --name="+lv_name[1]+" --fstype="+lv_fst[1]+" --size="+lv_size[1]+" --grow --maxsize="+lv_maxsize[1]);
                    }
                    else
                    {
                        $('#part_line3_'+i3+'_1').text("logvol " + lv_mnt_pt[1] + " --vgname=" + lv_vg[1] + " --name=" + lv_name[1] + " --fstype=" + lv_fst[1] + " --size=" + lv_size[1]);
                    }
                }
        }
        //file logic (Network Configuration)
        if(flag_preview_net>0)
        {
            flag_preview_net=0;
            for(i=1;i<last_lines;i++)
            {
                $("#net_line1_"+i).remove();
            }
        }

        flag_preview_net++;
        // Network file Logic.
        if(document.getElementById("net_check_default_network").checked == true)
        {
            $("#net_line1").text("#No network device information");
        }
        else
        {
            // logic to get vg and lv
            all_dev = $('#net_txt_all_devices').val();
            dev_list = all_dev.split("$$");
            t1=dev_list.length;
            $("#net_line1").text("#Network device information");
            last_lines=t1;
            for(i=1,i2=0;i<t1;i++,i2++)
            {
                dev_field=dev_list[i].split(" ");
                if(dev_field.length==7)
                {
                    dev_name=dev_field[1].split(':');
                    dev_protocol=dev_field[2].split(':');
                    dev_ip=dev_field[3].split(':');
                    dev_netmask= dev_field[4].split(':');
                    dev_gateway = dev_field[5].split(':');
                    dev_nameserver = dev_field[6].split(':');
                    if(i==1)
                    {
                        $("#net_line1").clone().attr('id','net_line1_'+i).insertAfter('#net_line1');
                        $("#net_line1_"+i).text("network --device=" + dev_name[1] + ' --bootproto=' + dev_protocol[1] + ' --ip=' + dev_ip[1] + " --netmask=" + dev_netmask[1] + " --gateway=" + dev_gateway[1] + " --nameserver=" + dev_nameserver[1]);
                    }
                    else
                    {
                        $("#net_line1").clone().attr('id','net_line1_'+i).insertAfter('#net_line1_'+i2);
                        $("#net_line1_"+i).text("network --device=" + dev_name[1] + ' --bootproto=' + dev_protocol[1] + ' --ip=' + dev_ip[1] + " --netmask=" + dev_netmask[1] + " --gateway=" + dev_gateway[1] + " --nameserver=" + dev_nameserver[1]);
                    }
                }
                else
                {
                    dev_name = dev_field[1].split(':');
                    dev_protocol = dev_field[2].split(':');
                    if(i==1)
                    {
                        $("#net_line1").clone().attr('id','net_line1_'+i).insertAfter('#net_line1');
                        $("#net_line1_"+i).text("network --device=" + dev_name[1] + ' --bootproto=' + dev_protocol[1]);
                    }
                    else
                    {
                        $("#net_line1").clone().attr('id','net_line1_'+i).insertAfter('#net_line1_'+i2);
                        $("#net_line1_"+i).text("\nnetwork --device=" + dev_name[1] + ' --bootproto=' + dev_protocol[1]);
                    }
                }
            }
        }
        //file logic (Authentication Configuration)
        var file_auth_line2 = "auth";
        var auth_security_algo = document.getElementById('auth_security_algo').value;
        if (document.getElementById("auth_shadow_pass").checked == true) {
            file_auth_line2 = file_auth_line2 + " --useshadow";
        }
        file_auth_line2 = file_auth_line2 + auth_security_algo;
        if (document.getElementById("auth_finger_reader").checked == true) {
            file_auth_line2 = file_auth_line2 + " --enablefingerprint";
        }
        if (document.getElementById("auth_enable_nis").checked == true) {
            file_auth_line2 = file_auth_line2 + " --enablenis --nisdomain=" + document.getElementById('auth_nis_domain').value;
            if (document.getElementById("auth_broadcast_nis").checked != true) {
                file_auth_line2 = file_auth_line2 + " --nisserver=" + document.getElementById('auth_nis_server').value;
            }
        }
        if (document.getElementById("auth_enable_ldap").checked == true) {
            file_auth_line2 = file_auth_line2 + " --enableldap --enableldapauth --ldapserver=";
            file_auth_line2 = file_auth_line2 + document.getElementById('auth_ldap_server').value;
            file_auth_line2 = file_auth_line2 + " --ldapbasedn=" + document.getElementById('auth_ldap_base').value;
            if (document.getElementById("auth_ldap_certificate").checked == true) {
                file_auth_line2 = file_auth_line2 + " --ldaploadcacert=" + document.getElementById('auth_ldap_cert_url').value;
            }
        }
        if (document.getElementById("auth_enable_krb5").checked == true) {
            file_auth_line2 = file_auth_line2 + " --enablekrb5 --krb5realm=" + document.getElementById('auth_krb5_realm').value;
            file_auth_line2 = file_auth_line2 + " --krb5kdc=" + document.getElementById('auth_kerberos_domain').value;
            file_auth_line2 = file_auth_line2 + " --krb5adminserver=" + document.getElementById('auth_krb5_master').value;
        }
        if (document.getElementById("auth_enable_smb").checked == true) {
            file_auth_line2 = file_auth_line2 + " --enablesmbauth --smbservers=" + document.getElementById('auth_smb_server').value;
            file_auth_line2 = file_auth_line2 + " --smbworkgroup=" + document.getElementById('auth_smb_workgrp').value;
        }
        if (document.getElementById("auth_switch_cache").checked == true) {
            file_auth_line2 = file_auth_line2 + " --enablecache";
        }
        $("#file_auth_config_line2").text(file_auth_line2);
        //file logic (Firewall Configuration)
        var firewall_selinux_state = document.getElementById('firewall_selinux_state').value ;
		var firewall_sequrity_level = document.getElementById('firewall_sequrity_level').value ;
		if(firewall_sequrity_level == "Disable_firewall"){
		firewall_sequrity_level = "firewall --disabled" ; 
		
		}
	if(firewall_sequrity_level == "Enable_firewall"){
		firewall_sequrity_level = "firewall --enabled" ;
		if(document.getElementById("firewall_http_service").checked == true){
			firewall_sequrity_level = firewall_sequrity_level + " --http";		
		}
		if(document.getElementById("firewall_ftp_service").checked == true){
			firewall_sequrity_level = firewall_sequrity_level + " --ftp";		
		}
		if(document.getElementById("firewall_ssh_service").checked == true){
			firewall_sequrity_level = firewall_sequrity_level + " --ssh";		
		}
		if(document.getElementById("firewall_telnet_service").checked == true){
			firewall_sequrity_level = firewall_sequrity_level + " --telnet";		
		}
		if(document.getElementById("firewall_mail_service").checked == true){
			firewall_sequrity_level = firewall_sequrity_level + " --smtp";		
		}
		if(document.getElementById("firewall_other_port").value != ""){
			var port_data = document.getElementById("firewall_other_port").value;
			firewall_sequrity_level = firewall_sequrity_level + " --port=" + port_data;		
		} 	
	}
	$("#file_firewall_line1").text("# SELinux configuration");
	$("#file_firewall_line2").text(firewall_selinux_state);
	$("#file_firewall_line3").text("# Firewall configuration");
	$("#file_firewall_line4").text(firewall_sequrity_level);
        //file logic (Display Configuration)
        //file logic (Package Configuration)
        //file logic (Pre-Installtion Configuration)
        if(document.getElementById("pre_interpreter_enble").checked == true) {
            var pre_start = "%pre"
            if (document.getElementById("pre_inter_allow").checked == true) {
                pre_start = pre_start + " --interpreter=" + document.getElementById("pre_interpreter_name").value;
            }
            $("#file_pre_line1").text(pre_start);
            $("#file_pre_line2").text($("#pre_interpreter_scr").val());
            $("#file_pre_line3").text("%end");
        }
        if(document.getElementById("pre_interpreter_enble").checked == false) {
            $("#file_pre_line1").text("");
            $("#file_pre_line2").text("");
            $("#file_pre_line3").text("");
        }
        //file logic (Post-Installtion Configuration)
        if(document.getElementById("post_interpreter_enble").checked == true) {
            var post_start = "%post"
            if (document.getElementById("post_inter_allow").checked == true) {
                post_start = post_start + " --interpreter=" + document.getElementById("post_interpreter_name").value;
            }
            if (document.getElementById("post_nochroot_allow").checked == true) {
                post_start = post_start + " --nochroot";
            }
            $("#file_post_line1").text(post_start);
            $("#file_post_line2").text($("#post_interpreter_scr").val());
            $("#file_post_line3").text("%end");
        }
        if(document.getElementById("post_interpreter_enble").checked == false) {
            $("#file_post_line1").text("");
            $("#file_post_line2").text("");
            $("#file_post_line3").text("");
        }
        
        

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    });
});
