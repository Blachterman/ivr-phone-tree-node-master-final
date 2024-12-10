const VoiceResponse = require('twilio').twiml.VoiceResponse;

/*
* https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice for deployment to azure tools
* ngrok.exe http 3000   to expose the local running node program to the internet
* Add that outward ngrok url to twilio webhook.  Something like
*        https://ccc0-73-21-206-159.ngrok.io//ivr/welcome
* Current production is https://utmivr.azurewebsites.net/ivr/welcome
* local test would be http://localhost:3000/
* tutorial https://www.twilio.com/docs/voice/tutorials/build-interactive-voice-response-ivr-phone-tree/node
* npm install -g win-node-env     if it can't find npm or node
* node -v      and npm -v        to make sure they are ready  then npm start
* deploy to azure production  click the A then click pay-as-you-go,
*        then click app-services, then right click utmIVR (be very careful)
* github instructions https://github.com/TwilioDevEd/ivr-phone-tree-node
* http://localhost:3000/  after npm start
* control-c to stop the run
* https://www.jcchouinard.com/create-your-first-github-project-in-vscode/ to create repo
*/

exports.welcome = function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    // 'You handsome stud. ' +
    'Thank you for calling You This Me and UTM  Healthcare. ' +
    'Please press 1 for Sales. ' +
    'Press 2 for technical support. ' +
    'Press 3 for a company directory.'
  );

  return voiceResponse.toString();
};

exports.menu = function menu(digit) {
  const optionActions = {
    '1': salesresponse,
    '2': customerservice,
    '3': companydir,
  };

  return (optionActions[digit])
    ? optionActions[digit]()
    : redirectWelcome();
};

exports.mainnums = function mainnums(digit) {
  const optionActions = {
    '2': '+15189296848',
    '3': '+15189296848',
    '4': '+15189296848',
  };

  if (optionActions[digit]) {
    const twiml = new VoiceResponse();
    twiml.dial(optionActions[digit]);
    return twiml.toString();
  }
  redirectWelcome();
  return twiml.toString();
};

/**
 * Returns Twiml
 * @return {String}
 */
function giveExtractionPointInstructions() {
  const twiml = new VoiceResponse();

  twiml.say(
    'To get to your extraction point, get on your bike and go down ' +
    'the street. Then Left down an alley. Avoid the police cars. Turn left ' +
    'into an unfinished housing development. Fly over the roadblock. Go ' +
    'passed the moon. Soon after you will see your mother ship.',
    {voice: 'alice', language: 'en-GB'}
  );

  twiml.say(
    'Thank you for calling You This Me and You Tee Emm Healthcare. ' +
    'Good Bye.'
  );

  twiml.hangup();

  return twiml.toString();
}

/**
 * Sales response - goes to Sales Number
 * @return {String}
 */
function companydir() {
   const twiml = new VoiceResponse();
   twiml.say(
    'Unfortunately the company directory is being updated at this time. ' +
    'Returning to the main menu. ',
   {voice: 'alice', language: 'en-GB'}
);
  
return redirectWelcome();
};
  
function salesresponse() {
   const twiml = new VoiceResponse();
   twiml.say(
    'Transferring your call to our sales team. ' +
    'Please hold. ',
   {voice: 'alice', language: 'en-GB'}
);

twiml.dial('+15189296848');
return twiml.toString();
};

/**
 * Returns a TwiML to interact with the client
 * @return {String}
 */
function customerservice() {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: '/ivr/mainnums',
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'If you need assistance installing RPM  please press 2. ' +
  'If you are a customer and your not able to get patient responses press 3. ' +
    'For all other technical issues please press 4. ' +
'To go back to the main menu, press the star key ',
    {voice: 'alice', language: 'en-GB', loop: 3}
  );

  return twiml.toString();
}

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const twiml = new VoiceResponse();

  twiml.say('Returning to the main menu', {
    voice: 'alice',
    language: 'en-GB',
  });

  twiml.redirect('/ivr/welcome');

  return twiml.toString();
}
