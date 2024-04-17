function sendJson(usersRef, gmailEmail,gmailPassword,ccID, after,table_P,table_E){
  const fileName=after.company.toUpperCase() +".json";
  const tempFilePath = path.join(os.tmpdir(), fileName);
  
    const mailOptions = {
      from: gmailEmail,
      to: after.id,  //receiver
      cc: 'ilesh.dattani@assentian.com',  
       //'johnbighamgm@gmail.com, ilesh.dattani@assentian.com'
      bcc:ccID,
      attachments: [{
             path: tempFilePath
         }]
     };

//let username;


//const userName=capitalizeFirstLetter(original.username);

//var userId = admin.auth().currentUser.uid; //This is the firebase unique user ID


//const usersRef = admin.database().ref('/combinedusers/' + userId);
        //usersRef.update(cust);

 //       usersRef.update({shouldSendJson: "no"}) 



usersRef.once('value').then((snapshot) => {           //  GETTING THE DATA FOR THE SUBMISSION
let data2= snapshot.val();
//let username= data2.username;
let language=data2.language;

//console.log("Language in email    " + language)
let capitalised;
capitalised=capitalizeFirstLetter(after.username);

//    q     ["2","3","0","2","2","1","1","2","1","2","0","1","0","1","0","0","1","1","1","0","4"]
const q=JSON.parse(data2.historySecurity);
//const q=data2.historySecurity;
console.log("    q     "   +  q)
let subject;
let textEmail;

if (language==="English"){
  textEmail= "Dear  " + capitalised + ", \nJson security assessment attached"
  subject='The Security Assessment JSON file ' + companyName.toUpperCase();}
 
  if (language==="Portugese"){
    textEmail= "Prezado " + capitalised + ", \nAvaliação de segurança Json anexada"
    subject='O arquivo JSON de avaliação de segurança';}
 
 mailOptions.subject = subject
 mailOptions.text =textEmail
 
 
let question_answers;
if(language==="English") 
      {question_answers=table_E['rows']} 
      else {question_answers=table_P}

var dict = {};
 for (var value of question_answers) {
   dict[value[0]]=value[1]
  //console.log("values    " + value[0] + " : " + value[1] );
}
//The JSON.stringify() method converts a JavaScript object or value to a JSON string,
let jsonString=JSON.stringify(dict)
console.log("jsonString " + jsonString);

//*******************************************************************************************************************

// Stream contents to a file
const fs = require('fs') 
  fs.writeFile(tempFilePath, jsonString, err => {
    if (err) {
          console.log('Error writing file', err)
              } 
        else 
        {
        console.log('Successfully written to file')
        return mailTransport.sendMail(mailOptions, (error,info)=>{
            if(error) 
                { return console.log('send mail error  ', error)}
              else
                {
                fs.unlink(tempFilePath, (err) => {
                    if (err) {
                        console.log('Failed to delete temp file:'+err);
                      } else {
                          console.log('Successfully deleted temp file');
                        }
                          //return null;
                    });  //unlink
                  return console.log('Email sent  '+ info.response);
                }
          }) //sendmail
        } //NOT ERROR IN WRITEfILE
      })

return null;
})
}

module.exports = { sendJson };