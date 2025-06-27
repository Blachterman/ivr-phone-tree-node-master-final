const { welcome, menu } = require('../../src/ivr/handler');

describe('IvrHandler#Welcome', () => {
  it('should serve TwiML with gather and correct prompt', () => {
    const twiml = welcome();
    const count = countWord(twiml);

    expect(count('Gather')).toBe(1);
    expect(count('Say')).toBe(1);
    expect(twiml).toContain('action="/ivr/menu"');
    expect(twiml).toContain('numDigits="1"');
    expect(twiml).toContain('loop="3"');
    expect(twiml).toContain('Thank you for calling You This Me and UTM  Healthcare');
  });
});

describe('IvrHandler#Menu', () => {
  it('should redirect to welcome if digit is invalid', () => {
    const twiml = menu('7');
    const count = countWord(twiml);

    expect(count('Redirect')).toBe(1);
    expect(twiml).toContain('/ivr/welcome');
  });

  it('should route to sales response when digit is 1', () => {
    const twiml = menu('1');
    expect(twiml).toContain('Transferring your call to our sales team');
    expect(twiml).toContain('<Dial>+15182825515</Dial>');
  });

  it('should route to customer service when digit is 2', () => {
    const twiml = menu('2');
    expect(twiml).toContain('If you need assistance installing RPM');
    expect(twiml).toContain('action="/ivr/mainnums"');
    expect(twiml).toContain('loop="3"');
  });

  it('should route to company directory when digit is 3', () => {
    const twiml = menu('3');
    expect(twiml).toContain('Unfortunately the company directory is being updated');
    expect(twiml).toContain('<Redirect>ivr/welcome</Redirect>');
  });
});

function countWord(paragraph) {
  return (word) => {
    const regex = new RegExp(`<${word}[\\s/>]|</${word}>`, 'g');
    return (paragraph.match(regex) || []).length;
  };
}
