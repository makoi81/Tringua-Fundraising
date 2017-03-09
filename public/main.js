console.log('in my javcascript on the front end')
function modal(){
	console.log('clicking the button')
    basicModal.show({
        body: '<p>This type of modal can be used to ask the user questions. Are you sure you want to continue?</p>',
        closable: true,
        buttons: {
            cancel: {
                title: 'Cancel',
                fn: basicModal.close
            },
            action: {
                title: 'Continue',
                fn: basicModal.close
            }
        }
    });
}

//document.querySelector('#unsub').onclick = modal;
$('#unsub').click(modal);