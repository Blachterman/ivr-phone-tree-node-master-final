const { welcome, menu } = require('../../src/ivr/handler');

describe('IvrHandler#Welcome', () => {
  it('should serve TwiML with gather', () => {
    const twiml = welcome();
    const count = countWord(twiml);

    expect(count('Gather')).toBe(2);
    expect(count('Say')).toBe(2);
    expect(twiml).toContain('action="/ivr/menu"');
    expect(twiml).toContain('numDigits="1"');
    expect(twiml).toContain('loop="3"');
    expect(twiml).toContain('Thanks for calling the E T Phone Home Service.');
  });
});

describe('IvrHandler#Menu', () => {
  it('should redirect to welcomes with digits other than 1 or 2', () => {
    const twiml = menu();
    const count = countWord(twiml);

    expect(count('Say')).toBe(2);
    expect(twiml).toContain('welcome');
  });

  it('should serve TwiML with say twice and hangup', () => {
    const twiml = menu('1');
    const count = countWord(twiml);

    expect(count('Say')).toBe(4);
    expect(count('Hangup')).toBe(1);
    expect(twiml).toContain('To get to your extraction point');
    expect(twiml).toContain('Thank you for calling the ET Phone Home Service');
  });

  it('should serve TwiML with gather and say', () => {
    const twiml = menu('2');
    const count = countWord(twiml);

    expect(count('Gather')).toBe(2);
    expect(count('Say')).toBe(2);
    expect(twiml).toContain('action="/ivr/menu"');
    expect(twiml).toContain('numDigits="1"');
    expect(twiml).toContain('To call the planet Broh doe As O G');
  });
});

function countWord(paragraph) {
  return (word) => {
    const regex = new RegExp(`<${word}[ | /?>]|</${word}>`, 'g');
    return (paragraph.match(regex) || []).length;
  };
}
