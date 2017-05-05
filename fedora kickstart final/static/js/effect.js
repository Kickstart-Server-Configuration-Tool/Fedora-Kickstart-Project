$(document).ready(function() {

    //display configuration
    $("#display_checkbox").click(function() {
        var isChecked = document.getElementById("display-checkbox").checked;
        document.getElementById("first-boot").disabled = !isChecked;
    });

    //Package_configuration
    $('#pkg_data').hide();
    $("#pkg_enb_chk").click(function() {
        $('#pkg_data').toggle();
    });
    // Gnome Desktop
    $("#pkg_gnome").click(function() {
        $('#pkg_gnome_package').show();
        $("div[id!='pkg_gnome_package'][class='pkg_packages']").hide();
    });
     // KDE Desktop
    $("#pkg_kde").click(function() {
        $('#pkg_kde_package').show();
        $("div[id!='pkg_kde_package'][class='pkg_packages']").hide();
    });
      // Xfce Desktop
    $("#pkg_xfce").click(function() {
        $('#pkg_xfce_package').show();
        $("div[id!='pkg_xfce_package'][class='pkg_packages']").hide();
    });
      // Chinnamon Desktop
    $("#pkg_chinn").click(function() {
        $('#pkg_chinn_package').show();
        $("div[id!='pkg_chinn_package'][class='pkg_packages']").hide();
    });
      // Applications
    $("#pkg_appli").click(function() {
        $('#pkg_appli_package').show();
        $("div[id!='pkg_appli_package'][class='pkg_packages']").hide();
    });
      // LXDE Desktop
    $("#pkg_lxde").click(function() {
        $('#pkg_lxde_package').show();
        $("div[id!='pkg_lxde_package'][class='pkg_packages']").hide();
    });
      // LXQt Desktop
    $("#pkg_lxqt").click(function() {
        $('#pkg_lxqt_package').show();
        $("div[id!='pkg_lxqt_package'][class='pkg_packages']").hide();
    });
    // Server
    $("#pkg_server").click(function() {
        $('#pkg_ser_package').show();
        $("div[id!='pkg_ser_package'][class='pkg_packages']").hide();
    });
            // Mate Desktop
    $("#pkg_mate").click(function() {
        $('#pkg_mate_package').show();
        $("div[id!='pkg_mate_package'][class='pkg_packages']").hide();
    });
     // Hawaii Desktop
    $("#pkg_hawaii").click(function() {
        $('#pkg_hawaii_package').show();
        $("div[id!='pkg_hawaii_package'][class='pkg_packages']").hide();
    });
    // Development
    $("#pkg_dev").click(function() {
        $('#pkg_dev_package').show();
        $("div[id!='pkg_dev_package'][class='pkg_packages']").hide();
    });
    // Content
    $("#pkg_cont").click(function() {
        $('#pkg_content_package').show();
        $("div[id!='pkg_content_package'][class='pkg_packages']").hide();
    });
    // Base
    $("#pkg_base").click(function() {
        $('#pkg_base_package').show();
        $("div[id!='pkg_base_package'][class='pkg_packages']").hide();
    });
    // Sugar
    $("#pkg_sugar").click(function() {
        $('#pkg_sugar_package').show();
        $("div[id!='pkg_sugar_package'][class='pkg_packages']").hide();
    });
     // Uncategories
    $("#pkg_uncat").click(function() {
        $('#pkg_uncat_package').show();
        $("div[id!='pkg_uncat_package'][class='pkg_packages']").hide();
    });

    //basic
    //$('#boot_loader').hide();
    $("#target_architecture").change(function() {
        var target_architecture = $("#target_architecture").val();
        if (target_architecture == "x86, AMD64, or Intel EM64T") {
            $('#boot_loader').show();
        }
        if (target_architecture == "Intel Itanium") {
            $('#boot_loader').hide();
            $("#basic_effect").text("Note: Boot loader option not work on Intel Itanium in basic configuration");
        }
        if (target_architecture == "IBM iSeries") {
            $('#boot_loader').hide();
            $("#basic_effect").text("Note: Boot loader option not work on IBM iSeries  in basic configuration");
        }
        if (target_architecture == "IBM pSeries") {
            $('#boot_loader').hide();
            $("#basic_effect").text("Note: Boot loader option not work on IBM pSeries in basic configuration");
        }
        if (target_architecture == "IBM zSeries/s390") {
            $('#boot_loader').hide();
            $("#basic_effect").text("Note: Boot loader option not work on IBM zSeries/s390 in basic configuration");
        }
    });

    //installation_configuration
    $('.install_ser_dict').hide();
    $('.install_ftp_chk').hide();
    $('.install_ftp_userpass').hide();
    $("#install_cd_rom").click(install_media1);
    $("#install_nfs").click(install_media2);
    $("#install_http").click(install_media3);
    $("#install_ftp").click(install_media4);
    $("#install_hard_drive").click(install_media5);
    $("#install_check_ftp").click(install_media6);
    //boot loader
     $('#grub_opt').hide();
     $("#Bootloader_GRUB").click(boot_hide1);
    $("#b1").click(function() {
        $('#boot_hide').show();
    });
    $("#b3").click(function() {
        $('#boot_hide').hide();
    });
    $("#b2").click(function() {
        $('#boot_hide').hide();
    });

    //Pre_Script Configuration
    $('#pre_interpreter_name').hide();
    $('#pre_init_name').hide();
    $('#pre_data').hide();
    $("#pre_interpreter_enble").click(function() {
        $('#pre_data').toggle();
    });
    $("#pre_inter_allow").click(pre_interpreter);
    //Post_Script Configuration
    $('#post_interpreter_name').hide();
    $('#post_init_name').hide();
    $('#post_data').hide();
    $("#post_interpreter_enble").click(function() {
        $('#post_data').toggle();
    });
    $("#post_inter_allow").click(post_interpreter);
    //Authentication
    $('#auth_nis_block').hide();
    $('#auth_ldap_block').hide();
    $('#auth_krb_block').hide();
    $('#auth_smb_block').hide();
    $("#auth_ldap_cert_url_label").hide();
    $("#auth_ldap_cert_url").hide();
    $("#auth_enable_nis").click(auth_config1);
    $("#auth_enable_ldap").click(auth_config2);
    $("#auth_enable_krb5").click(auth_config3);
    $("#auth_enable_smb").click(auth_config4);
    //firewaall_configration
    $("#firewall_sequrity_level").click(function() {
        var firewall_sequrity_status = $("#firewall_sequrity_level").val();
        if (firewall_sequrity_status == "Disable_firewall") {
            $('#firewall_trusted_service_config').hide();
        }
        if (firewall_sequrity_status == "Enable_firewall") {
            $('#firewall_trusted_service_config').show();
        }
    });
       //network configuration
    $("#net_combo_net_type").click(function() {
        var net_combo_net_type = $("#net_combo_net_type").val();
        if (net_combo_net_type == "dhcp") {
            $('#net_txt_ip').attr('disabled','disabled');
            $('#net_txt_netmask').attr('disabled','disabled');
            $('#net_txt_gateway').attr('disabled','disabled');
            $('#net_txt_nameserver').attr('disabled','disabled');
        }
        if (net_combo_net_type == "bootp") {
           $('#net_txt_ip').attr('disabled','disabled');
            $('#net_txt_netmask').attr('disabled','disabled');
            $('#net_txt_gateway').attr('disabled','disabled');
            $('#net_txt_nameserver').attr('disabled','disabled');
        }
        if (net_combo_net_type == "static") {
            $('#net_txt_ip').removeAttr('disabled');
            $('#net_txt_netmask').removeAttr('disabled');
            $('#net_txt_gateway').removeAttr('disabled');
            $('#net_txt_nameserver').removeAttr('disabled');
        }
    });
    var net_device_count = 0;
    //$("#net_main_div").hide();
    $("#net_device_delete").hide();
    $("#net_add_device_div").hide();
    $('#net_txt_all_devices').hide();
    $("#net_bt_edit_device_info").hide();
    $("#net_bt_preview").hide();
    $("#net_submit_preview").hide();
    $("#net_check_default_network").click(function() {
        $("#net_main_div").toggle();
        $("#net_bt_save_device_info").toggle();
        $("#net_bt_preview").toggle();
        $("#net_submit_preview").toggle();
    });
    $("#net_bt_add").click(function() {
        $("#net_add_device_div").toggle();
        $("#net_bt_add").toggle();
    });
    $("#net_save_device").click(function() {
        $("#net_add_device_div").toggle();
        last_device_count = net_device_count;
        net_device_count++;
        if (last_device_count == 0) {
            $("#net_devices").clone().attr('id', 'dev_' + net_device_count).insertAfter('#net_devices');
        } else {
            $("#net_devices").clone().attr('id', 'dev_' + net_device_count).insertAfter('#dev_' + last_device_count);
        }
        if ($("#net_combo_net_type").val() == 'static') {
            $("#dev_" + net_device_count).text("Dev_No:" + net_device_count + " Name:" + $("#net_txt_device_name").val() + " Network_Type:" + $("#net_combo_net_type").val() + " IP:" + $("#net_txt_ip").val() + " Netmask:" + $("#net_txt_netmask").val() + " Gateway:" + $("#net_txt_gateway").val() + " Name_Server:" + $("#net_txt_nameserver").val());
        } else {
            $("#dev_" + net_device_count).text("Dev_No:" + net_device_count + " " + "Name:" + $("#net_txt_device_name").val() + " " + "Network_Type:" + $("#net_combo_net_type").val());
        }
        if (net_device_count == 1) {
            $("#net_device_delete").show();
        }
        $("#net_bt_add").toggle();
    });
    $("#net_bt_delete").click(function() {
        var dev_no = $("#net_txt_delete_dev_no").val();;
        $("#dev_" + dev_no).remove();
        net_device_count--;
        if (net_device_count == 0) {
            $("#net_device_delete").hide();
        }
    });
    $("#net_cancle_device").click(function() {
        $("#net_add_device_div").toggle();
        $("#net_bt_add").toggle();
    });
    $("#net_bt_save_device_info").click(function() {
        for (var i = 1; i <= net_device_count; i++) {
            $("#net_txt_all_devices").val($("#net_txt_all_devices").val() + "$$" + $("#dev_" + i).text());
        }
        $("#net_main_div").toggle();
        $("#net_bt_edit_device_info").toggle();
        $("#net_bt_save_device_info").toggle();
        $("#net_bt_preview").toggle();
        $("#net_submit_preview").toggle();
    });
    $("#net_bt_edit_device_info").click(function() {
        $("#net_txt_all_devices").val("0");
        $("#net_main_div").toggle();
        $("#net_bt_save_device_info").toggle();
        $("#net_bt_edit_device_info").toggle();
        $("#net_bt_preview").toggle();
        $("#net_submit_preview").toggle();
    });

    //Partition_configuration
    $("#prt_combo_lv_grow").change(function() {
        var prt_combo_lv_grow = $("#prt_combo_lv_grow").val();
        if (prt_combo_lv_grow == "no") {
            $('#prt_max_size').hide();
        }
        if (prt_combo_lv_grow == "yes") {
            $('#prt_max_size').show();
        }
    });
    var vg_count=0,lv_count=0;


    $("#prt_div_add_VG").hide();
    $("#prt_div_add_LV").hide();
    $("#prt_check_initlabel").hide();
    $("#prt_div_delete_vg_no").hide();  // text
    $("#prt_deletevg").hide();          // button

    $("#prt_div_delete_lv_no").hide();  // text
    $("#prt_deletelv").hide();  // button

    $("#prt_bt_edit").hide();
    $("#prt_all_vg").hide();
    $("#prt_all_lv").hide();

    $("#prt_check_rmallpart").click(function(){
    $("#prt_check_initlabel").toggle();
    });

    $("#prt_check_autopart").click(function(){
    $("#prt_main").toggle();
    $("#prt_bt_save").toggle();
    $("#prt_bt_edit").hide();
    });

    $("#prt_addvg").click(function(){
    $("#prt_div_add_VG").show();
    });

    $("#prt_vgadded").click(function(){
    $("#prt_div_add_VG").hide();
        var lastvg=vg_count;
        vg_count++;

        if(lastvg==0)
        {
            $("#prt_label_vgdetail").clone().attr('id','vg_'+vg_count).insertAfter('#prt_label_vgdetail');
        }
        else
        {
            $("#prt_label_vgdetail").clone().attr('id','vg_'+vg_count).insertAfter("#vg_"+lastvg);
        }

        $("#vg_"+vg_count).text("Vg_No:"+vg_count+" "+"Name:"+$("#prt_txt_vgname").val()+" "+"Disk:"+$("#prt_txt_vgdisk").val()+" "+"VG_Size:"+$("#prt_txt_vgsize").val()+" "+"Physical_Extent_Size(kB):"+$("#prt_txt_vgpesize").val());
        if(vg_count==1)
        {
            $("#prt_div_delete_vg_no").show();
            $("#prt_deletevg").show();
        }
    });

    $("#prt_deletevg").click(function(){
    var vg_no=$("#prt_delete_vg_no").val();;
    $("#vg_"+vg_no).remove();
    vg_count--;
     if(vg_count==0)
     {
        $("#prt_div_delete_vg_no").hide();
        $("#prt_deletevg").hide();
     }
    });

    $("#prt_vg_cancle_added").click(function(){
        $("#prt_div_add_VG").hide();
    });



    // Lv Operations
    /*$("#prt_combo_lv_grow").onchange()
    {
        if($("#prt_combo_lv_grow").val()=="yes")
        {
            $("#prt_txt_lv_maxsize").attr("disabled", false);
        }
        else
        {
            $("#prt_txt_lv_maxsize").attr("disabled", true);
        }
    }*/

    $("#prt_addlv").click(function(){
    $("#prt_div_add_LV").show();
    });

    $("#prt_cancle_lvadded").click(function(){
        $("#prt_div_add_LV").hide();
    });

    $("#prt_lvadded").click(function(){
    $("#prt_div_add_LV").hide();
        var lastlv=lv_count;
        lv_count++;

        if(lastlv==0)
        {
            $("#prt_label_lvdetail").clone().attr('id','lv_'+lv_count).insertAfter('#prt_label_lvdetail');
        }
        else
        {
            $("#prt_label_lvdetail").clone().attr('id','lv_'+lv_count).insertAfter("#lv_"+lastlv);
        }

        if($("#prt_combo_lv_grow").val()=="yes")
        {
            //$("#prt_txt_lv_maxsize").attr("disabled", false);  "vg"+
            $("#lv_"+lv_count).text("LV_No:"+lv_count+" "+"Mount_Point:"+$("#prt_combo_lv_mountpoint").val()+" "+"Volume_Group:"+$("#prt_txt_lv_vgno").val()+" "+"LV_Name:"+$("#prt_txt_lv_name").val()+" "+"File_System_Type:"+$("#prt_combo_lv_fstype").val()+" "+"LV_Size(MB):"+$("#prt_txt_lvsize").val()+" Grow:yes maxsize:"+$("#prt_txt_lv_maxsize").val());
        }
        else
        {
            //$("#prt_txt_lv_maxsize").attr("disabled", true);
            $("#lv_"+lv_count).text("LV_No:"+lv_count+" "+"Mount_Point:"+$("#prt_combo_lv_mountpoint").val()+" "+"Volume_Group:"+$("#prt_txt_lv_vgno").val()+" "+"LV_Name:"+$("#prt_txt_lv_name").val()+" "+"File_System_Type:"+$("#prt_combo_lv_fstype").val()+" "+"LV_Size(MB):"+$("#prt_txt_lvsize").val());
        }


        if(lv_count==1)
        {
            $("#prt_div_delete_lv_no").show();
            $("#prt_deletelv").show();
        }
    });

    $("#prt_deletelv").click(function(){
    var lv_no=$("#prt_delete_lv_no").val();;
    $("#lv_"+lv_no).remove();
    lv_count--;
     if(lv_count==0)
     {
        $("#prt_div_delete_lv_no").hide();
        $("#prt_deletelv").hide();
     }
    });

    $("#prt_bt_save").click(function(){

     for(var i=1;i<=vg_count;i++)
     {
        $("#prt_all_vg").val($("#prt_all_vg").val()+"$$"+$("#vg_"+i).text());
     }

     for(i=1;i<=lv_count;i++)
     {
        $("#prt_all_lv").val($("#prt_all_lv").val()+"$$"+$("#lv_"+i).text());
     }

     $("#prt_main").toggle();
     $("#prt_bt_save").toggle();
     $("#prt_bt_edit").toggle();

    });

    $("#prt_bt_edit").click(function(){

        $("#prt_all_vg").val("0");
        $("#prt_all_lv").val("0");

     $("#prt_main").toggle();
     $("#prt_bt_edit").toggle();

    });
});

function auth_config1() {
    $('#auth_nis_block').toggle();
    $("#auth_broadcast_nis").click(function() {
        $("#auth_nis_server_label").toggle();
        $("#auth_nis_server").toggle();
    });
}

function auth_config2() {
    $('#auth_ldap_block').toggle();
    $("#auth_ldap_certificate").click(function() {
        $("#auth_ldap_cert_url_label").toggle();
        $("#auth_ldap_cert_url").toggle();
    });
}

function auth_config3() {
    $('#auth_krb_block').toggle();
}

function auth_config4() {
        $('#auth_smb_block').toggle();
    }
    //installation_configuration
function install_media1() {
    $('.install_ser_dict').hide();
    $('.install_ftp_chk').hide();
    $('.install_ftp_userpass').hide();
}

function install_media2() {
    $('.install_ser_dict').show();
    $('.install_ftp_chk').hide();
    $('.install_ftp_userpass').hide();
    $("#install_server_label").text("NFS Server");
    $("#install_directory_label").text("NFS Directory");
}

function install_media3() {
    $('.install_ser_dict').show();
    $('.install_ftp_chk').hide();
    $('.install_ftp_userpass').hide();
    $("#install_server_label").text("HTTP Server");
    $("#install_directory_label").text("HTTP Directory");
}

function install_media4() {
    $('.install_ser_dict').show();
    $('.install_ftp_chk').show();
    $('.install_ftp_userpass').hide();
    $("#install_server_label").text("FTP Server");
    $("#install_directory_label").text("FTP Directory");
}

function install_media5() {
    $('.install_ser_dict').show();
    $('.install_ftp_chk').hide();
    $('.install_ftp_userpass').hide();
    $("#install_server_label").text("Hard Drive Partition");
    $("#install_directory_label").text("Hard Drive Directory");
}

function install_media6() {
    $('.install_ftp_userpass').toggle();
}

function pre_interpreter() {
    $('#pre_interpreter_name').toggle();
    $('#pre_init_name').toggle();
}

function post_interpreter() {
    $('#post_interpreter_name').toggle();
    $('#post_init_name').toggle();
}

function boot_hide1(){
$('#grub_opt').toggle();
}