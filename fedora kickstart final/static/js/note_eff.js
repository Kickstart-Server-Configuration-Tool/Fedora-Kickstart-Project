  $(document).ready(function() {
                notify('black');
            });

            function notify(style) {
                $.notify({
                    title: 'Please select your choice for configuration !',
                    text: 'Later you can preview and save it as .cfg file.',
                    image: ''
                }, {
                    style: 'notify',
                    className: style,
                    autoHide: true,
                    clickToHide: true,
                      globalPosition: 'bottom left',
            
                });
            }
