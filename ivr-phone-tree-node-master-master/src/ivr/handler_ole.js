const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.welcome = function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
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
  };

  return (optionActions[digit])
    ? optionActions[digit]()
    : redirectWelcome();
};

exports.mainnums = function mainnums(digit) {
  const optionActions = {
    '2': '+15182840665',
    '3': '+15182840665',
    '4': '+15182840665',
  };

  if (optionActions[digit]) {
    const twiml = new VoiceResponse();
    twiml.dial(optionActions[digit]);
    return twiml.toString();
  }

  return redirectWelcome();
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

/** Sales response - goes to Sales Number
*/

function salesresponse() {
   const twiml = new VoiceResponse();
   twiml.say(
    'Transferring your call to our sales team. ' +
    'Please hold. ',
   {voice: 'alice', language: 'en-GB'}
 );

 twiml.dial('+19178567033');
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
