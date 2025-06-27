const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

function welcome() {
  const response = new VoiceResponse();
  const gather = response.gather({
    action: '/ivr/menu',
    numDigits: 1,
    method: 'POST'
  });

  gather.say({ loop: 3 }, 'Thanks for calling the E T Phone Home Service.');
  gather.say('Please press 1 for extraction instructions. Press 2 for planetary communications.');

  return response.toString();
}

function menu(digit) {
  const response = new VoiceResponse();

  if (digit === '1') {
    response.say('To get to your extraction point, get on your bike and go down the street. Then Left down an alley. Avoid the police cars. Turn left into an unfinished housing development. Fly over the roadblock. Go passed the moon. Soon after you will see your mother ship.');
    response.say('Thank you for calling the ET Phone Home Service - the adventurous alien\'s first choice in intergalactic travel');
    response.say('Stay safe and watch out for government agents.');
    response.say('Transmission ending now.');
    response.hangup();
  } else if (digit === '2') {
    const gather = response.gather({
      action: '/ivr/menu',
      numDigits: 1,
      method: 'POST'
    });

    gather.say({
      voice: 'alice',
      language: 'en-GB',
      loop: 3
    }, 'To call the planet Broh doe As O G, press 2. To call the planet DuhGo bah, press 3. To call an oober asteroid to your location, press 4. To go back to the main menu, press the star key ');

    response.say('Thank you for using our interstellar connection service.');
  } else {
    response.say('Invalid input. Redirecting you to the welcome menu.');
    response.say('Please hold.');
    response.redirect('/ivr/welcome');
  }

  return response.toString();
}

module.exports = { welcome, menu };
