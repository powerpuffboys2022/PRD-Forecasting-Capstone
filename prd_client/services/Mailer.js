// const nodeEmailer = require('nodemailer');

const sgMail = require("@sendgrid/mail");
const fs = require('fs');

const setApiKey = async () => { 
    const key = process.env.SENDGRID_KEY;
    sgMail.setApiKey(key);
}

setApiKey()

// const getFileContent = (template_content) => {
//     let contents = fs.readFileSync(`templates/${template_content.template_name}`, 'utf-8');
//     return contents;
// }

const templates = [
    { template_name : "forgotPassword", html : "<!DOCTYPE html><html lang=\"en\">  <head>    <meta charset=\"UTF-8\" />    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />    <title>Document</title>    <style>        .font-lato {            font-family: 'Lato', sans-serif;        }        .font-montserrat{            font-family: 'Montserrat', sans-serif        }        .text-col{             color : #473766        }        .justify{            text-align: justify;        }    </style>    <link    href=\"https://fonts.googleapis.com/css?family=Lato:400,700&display=swap\"    rel=\"stylesheet\"    type=\"text/css\"  />  <link    href=\"https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap\"    rel=\"stylesheet\"    type=\"text/css\"  />  </head>  <body style=\"background-color: rgb(249, 244, 251);\">    <center>        <div style=\"background-color: white; padding : 1rem; border-radius: 1rem; width: calc(560px);\">            <div style=\"background-color: rgb(247, 249, 250); padding:1rem; border-radius: 1rem; width : calc(520px);\">                <table        cellpadding=\"0\"        cellspacing=\"0\"        border=\"0\"        width=\"100%\"        style=\"          width: calc(500px);          border-radius: 1rem;          border-collapse: collapse;          margin: 0 auto;          background-color: white;          padding: 0;          overflow: hidden;        \"      >        <tbody>          <tr style=\"border-collapse: collapse; margin: 0; padding: 0\">            <td              width=\"100%\"              style=\"border-collapse: collapse; margin: 0; padding: 0\"            >              <table                width=\"100%\"                cellpadding=\"0\"                cellspacing=\"0\"                border=\"0\"                style=\"                  min-width: 100%;                  border-collapse: collapse;                  margin: 0;                  padding: 0;                \"              >                <tbody>                  <tr style=\"font-family: helvetica, sans-serif;                  font-weight: 100;                  text-decoration: none;                  color: #333333;                  font-size: 24px;                  border-collapse: collapse; margin: 0; padding: 0\">                    <td                      width=\"100%\"                      style=\"                        min-width: 100%;                        border-collapse: collapse;                        margin: 0;                        padding: 0;                      \"                    >                        <div style=\"margin: 0px 0px 30px 0px\">                            <div style=\"margin: 0px 0px 30px 0px\">                                <img src=\"https://cdn.discordapp.com/attachments/955281529481883729/1039349294387433592/Agriculture.png\"                                 style=\"width: 100%;\" ></img>                            </div>                            <div style=\"margin : 0px 20px 0px 20px\">                                <p class=\"text-col font-lato\" style=\"font-size: 1.5rem; font-weight: bold; \"><span style=\"font-weight: lighter;\">Hi, ${userName}</p>                                <p class=\"text-col  font-monsterrat justify\" style=\"font-size: 1rem; line-height: 2rem; font-weight: 500;\">You have requested for a temporary password today ${time_string}. You can use it to login to your account, just remember to change it afterwards.</p>                                <div class=\"font-monsterrat\" style=\"background-color:rgb(237, 237, 237); padding : 1rem; font-size: 1rem; font-weight: 400;\">                                    <p>${tempPass}</p>                                </div>                                <p class=\"text-col  font-monsterrat justify\" style=\"font-size: 1rem; line-height: 2rem; font-weight: 500;\"> Have a great day!</p>                            </div>                        </div>                    </td>                  </tr>                </tbody>              </table>            </td>          </tr>        </tbody>                </table>                <center>                    <table                      cellpadding=\"0\"                      cellspacing=\"0\"                      style=\"                        border-collapse: collapse;                        font-size: 13px;                        font-family: helvetica, sans-serif;                        line-height: 30px;                        border-spacing: 0px;                        width: 100%;                        margin-top: 2rem;                        width: calc(340px);                        padding: 0;                      \"                    >                      <tbody>                        <tr                          style=\"                            border-collapse: collapse;                            margin: 0;                          \"                        >                          <td                            align=\"center\"                            style=\"                              border-collapse: collapse;                              margin: 0;                              padding: 0;                            padding: 5;                            border-radius: 2%;                            \"                          >                                                          <p                                style=\"                                  font-family: helvetica, sans-serif;                                  text-decoration: none;                                  color: #383838;                                  font-size: 13px;                                  opacity: 0.7;                                  line-height: 1.5rem;                                  margin: 0;                                  padding: 0;                                \"                              >                              </p>                                                            </p>                          </td>                        </tr>                        <tr                          style=\"                            border-collapse: collapse;                            margin: 0;                            padding: 0;                          \"                        >                          <td                            align=\"center\"                            width=\"50\"                            height=\"50\"                            style=\"                              border-collapse: collapse;                              margin: 0;                              padding: 0;                            \"                          >                            <img                              src=\"https://cdn.discordapp.com/attachments/955281529481883729/1036886425045577758/prd.png\"                              alt=\"hero-image\"                              width=\"90\"                            />                          </td>                        </tr>                        <tr                          style=\"                            border-collapse: collapse;                            margin: 0;                          \"                        >                          <td                            align=\"center\"                            style=\"                              border-collapse: collapse;                              margin: 0;                              padding: 0;                            padding: 5;                            border-radius: 2%;                            \"                          >                                                          <p                              class=\"text-col font-lato\"                                style=\"                                  text-decoration: none;                                  font-size: 13px;                                  opacity : 0.7;                                  font-weight: 500;                                  color : #333333;                                  margin: 0;                                  padding: 0;                                \"                              >                              Philip Rice Dealer • Metro Manila, Philippines</p>                                                            </p>                          </td>                        </tr>                                                                      </tbody>                    </table>                </center>            </div>        </div>    </center>  </body></html>"},
    { template_name : "welcomeUser", html : "" },
    { template_name : "welcomeAdmin", html : "" },
    { template_name : "productPlaced", html : "" },
    { template_name : "productCancelled", html : "" },
    { template_name : "productProcessing", html : "" },
    { template_name : "productShipped", html : "" }
]

const getTemplate = ( template_name ) => {
    let toreturn = ""
    templates.forEach((tmps)=>{ if(tmps.template_name === template_name) toreturn = tmps.html })
    return toreturn
}

const transTemplate = (template_content) => {
    var template = require('es6-template-strings');
    return template(/*getFileContent(template_content)*/ getTemplate(template_content.template_name), {...template_content})
}

const sendEmail = async(userEmail, template_content) => {
    /**
     * user_email : string
     * template_content : {
     *  template_name : string
     *  ...other content
     * }
     */

    // let smtpTransport = nodeEmailer.createTransport({
    //     service: 'Gmail',
    //     port: 465,
    //     auth: {
    //         user: process.env.MASTEREMAIL,
    //         pass: process.env.MASTERPASS
    //     }
    // });
    
    let mailOptions = {
        // from: "uptech.coderph@gmail.com",
        from : "phscapstonesystem@gmail.com",
        // from : process.env.MASTEREMAIL,
        to: userEmail,
        subject : template_content.subject,    
        html: transTemplate(template_content)
    };

    // console.log(mailOptions.html)
    
    // let result = await smtpTransport.sendMail(mailOptions, (error, response) => {
    //     if (error) console.log("error ",error);
    //     else console.log('Sucess Sending To '+userEmail);
    // });

    // smtpTransport.close();
    // sendMail(mailOptions)

    try{
        const sent = await sgMail.send(mailOptions);
        console.log("Email Sent To "+userEmail, sent)
        return sent;
    }catch(e){
        console.log(e)
    }
}

module.exports = sendEmail