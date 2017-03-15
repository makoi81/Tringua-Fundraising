console.log('in my javcascript on the front end')
function modal(){
	console.log('clicking the button')
    basicModal.show({
        body: '<p>Are you sure you want to continue?</p>',
        closable: true,
        buttons: {
            cancel: {
                title: 'No',
                fn: basicModal.close
            },
            action: {
                title: 'Yes',
                fn: basicModal.close
            }
        }
    });
}
//document.querySelector('#unsub').onclick = modal;
$('#unsub').click(modal);