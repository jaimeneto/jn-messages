# jn-messages
A Javascript / CSS tool to handle many kinds of messages

## Available Options
- **wrapper**: element id to wrap the messages
- **type**: 'default' | 'floating' | 'corner'
- **closable**: true | false
- **counter**: true | false
- **timeout**: seconds to hide
- **max**: limit of messages

## Basic usage

### Create a Default Message Box
```
const msgs = new JnMessageBox({
    wrapper: '#defaultMsgs', 
    closable: true, 
    max: 5
});
```

### Create a Floating Message Box
```
const msgs = new JnMessageBox({
    wrapper: '#floatingMsgs', 
    type: 'floating', 
    closable: false, 
    timeout: 5
});
```

### Create a Corner Message Box
```
const msgs = new JnMessageBox({
    wrapper: '#cornerMsgs', 
    type: 'corner', 
    closable: true,
    counter: true, 
    max: 3
});
```

### Showing different types of message
```
msgs.alert('This is an <b>alert</b> message!');
msgs.success('This is a <b>success</b> message!');
msgs.error('This is an <b>error</b> message!');
msgs.info('This is an <b>info</b> message!');
```

### Hiding all the messages
```
msgs.hideAll();
```

## Defining Fixed messages with codes
```
const fixedMsgsJson = {
    "MSA-001": "This is a <u>fixed</u> <b>alert</b> message!",
    "MSS-001": "This is a <u>fixed</u> <b>success</b> message!",
    "MSE-001": "This is a <u>fixed</u> <b>error</b> message!",
    "MSI-001": "This is a <u>fixed</u> <b>info</b> message!"
};
const msgs = new JnFixedMessages({
    wrapper: '#fixedMsgs', 
    closable: false, 
    fixedMessages: fixedMsgsJson
});

msgs.alert("MSA-001");
msgs.success("MSS-001");
msgs.error("MSE-001");
msgs.info("MSI-001");
msgs.custom("This is a custom message!", 'alert');
msgs.info("INVALID");
```

### Available Options
- Inherits all JnMessageBox options
- **fixedMessages**: JSON containing a list of messages like {code1: text1, code2: text2}

See more on the demo file within the repository
