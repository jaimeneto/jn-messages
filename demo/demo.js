/* DEFAULT MESSAGES */
const defaultMsgs = new JnMessageBox({
    wrapper: '#defaultMsgs', 
    closable: true, 
    max: 5
});
document.querySelector('#defaultAlertBtn').onclick = function() {
    defaultMsgs.alert('This is an <b>alert</b> message!');
};
document.querySelector('#defaultSuccessBtn').onclick = function() {
    defaultMsgs.success('This is a <b>success</b> message!');
};
document.querySelector('#defaultErrorBtn').onclick = function() {
    defaultMsgs.error('This is an <b>error</b> message!');
};
document.querySelector('#defaultInfoBtn').onclick = function() {
    defaultMsgs.info('This is an <b>info</b> message!');
};
document.querySelector('#defaultClearBtn').onclick = function() {
    defaultMsgs.hideAll();
};

/* FLOATING MESSAGES */
const floatingMsgs = new JnMessageBox({
    wrapper: '#floatingMsgs', 
    type: 'floating', 
    closable: false, 
    timeout: 5
});
document.querySelector('#floatingAlertBtn').onclick = function() {
    floatingMsgs.alert('This is an <b>alert</b> floating message!');
};
document.querySelector('#floatingSuccessBtn').onclick = function() {
    floatingMsgs.success('This is a <b>success</b> floating message!');
};
document.querySelector('#floatingErrorBtn').onclick = function() {
    floatingMsgs.error('This is an <b>error</b> floating message!');
};
document.querySelector('#floatingInfoBtn').onclick = function() {
    floatingMsgs.info('This is an <b>info</b> floating message!');
};
document.querySelector('#floatingAllBtn').onclick = function() {
    floatingMsgs.alert('This is an <b>alert</b> floating message!');
    floatingMsgs.success('This is a <b>success</b> floating message!');
    floatingMsgs.error('This is an <b>error</b> floating message!');
    floatingMsgs.info('This is an <b>info</b> floating message!');
};

/* CORNER MESSAGES */
const cornerMsgs = new JnMessageBox({
    wrapper: '#cornerMsgs', 
    type: 'corner', 
    closable: true, 
    counter: true, 
    max: 3
});
document.querySelector('#cornerAlertBtn').onclick = function() {
    cornerMsgs.alert('This is an <b>alert</b> corner message!');
};
document.querySelector('#cornerSuccessBtn').onclick = function() {
    cornerMsgs.success('This is a <b>success</b> corner message!');
};
document.querySelector('#cornerErrorBtn').onclick = function() {
    cornerMsgs.error('This is an <b>error</b> corner message!');
};
document.querySelector('#cornerInfoBtn').onclick = function() {
    cornerMsgs.info('This is an <b>info</b> corner message!');
};
document.querySelector('#cornerCustomBtn').onclick = function() {
    cornerMsgs.alert({text: 'This is a custom message, not closable and with timeout!', closable: false, timeout: 3});
};
document.querySelector('#cornerClearBtn').onclick = function() {
    cornerMsgs.hideAll();
};

// Using FIXED MESSAGES
const fixedMsgsJson = {
    "MSA-001": "This is a <u>fixed</u> <b>alert</b> message!",
    "MSS-001": "This is a <u>fixed</u> <b>success</b> message!",
    "MSE-001": "This is a <u>fixed</u> <b>error</b> message!",
    "MSI-001": "This is a <u>fixed</u> <b>info</b> message!"
};
const fixedMsgs = new JnFixedMessages({
    wrapper: '#fixedMsgs', 
    closable: false, 
    fixedMessages: fixedMsgsJson
});

fixedMsgs.alert("MSA-001");
fixedMsgs.success("MSS-001");
fixedMsgs.error("MSE-001");
fixedMsgs.info("MSI-001");
fixedMsgs.custom("This is a custom message!", 'alert');
fixedMsgs.info("INVALID");