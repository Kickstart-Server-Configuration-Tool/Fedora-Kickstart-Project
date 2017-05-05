
$(document).ready(function(){

	//notify('black');
	var isChecked = document.getElementById("display-checkbox").checked;
    document.getElementById("first-boot").disabled = !isChecked;
	$.notify({
            		title: 'Please select your choice for configuration !',
            		text: 'Later you can preview and save it as .cfg file.',
            		image: ''
            	},{
            		style: 'notify',
            		className: 'black',
            		autoHide: true,
            		clickToHide: true,
            		globalPosition: 'bottom left',
            
            });
            
});
