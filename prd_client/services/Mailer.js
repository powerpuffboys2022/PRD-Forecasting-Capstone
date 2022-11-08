const sgMail = require("@sendgrid/mail");
const fs = require('fs');

const setApiKey = async () => { 
    const key = process.env.SENDGRID_KEY;
    sgMail.setApiKey(key);
}

setApiKey()

const getFileContent = (template_content) => {
    let contents = fs.readFileSync(`templates/${template_content.template_name}`, 'utf-8');
    return contents;
}

const transTemplate = (template_content) => {
    var template = require('es6-template-strings');
    return template(getFileContent(template_content), {...template_content})
}

const sendMail = async(msg) => {
    try{
        const sent = await sgMail.send(msg);
        console.log("Emal Sent")
        return sent;
    }catch(e){
        console.log(e)
    }
}

const sendEmail = async(userEmail, template_content) => {
    /**
     * user_email : string
     * template_content : {
     *  template_name : string
     *  ...other content
     * }
     */
    
    let mailOptions = {
        // from: "uptech.coderph@gmail.com",
        from : "phscapstonesystem@gmail.com",
        to: userEmail,
        subject : template_content.subject,    
        html: transTemplate(template_content)
    };
    sendMail(mailOptions)
}

module.exports = sendEmail