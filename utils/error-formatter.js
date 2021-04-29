module.exports.errorFormatter = ({ msg, param }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${param.replace('user.', '')}: ${msg}`;
};
