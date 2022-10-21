const TokenGenerator = require('uuid-token-generator');

const TokenGen = () => {
    const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
    return tokgen2.generate();
}

module.exports = TokenGen
