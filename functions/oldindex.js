"use strict";
/* eslint max-len: "off", require-jsdoc: "off", camelcase: "off", no-unused-vars: "off", prefer-const: "off", no-undef: "off" */
const functions = require("firebase-functions");
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();
const PDFDocument = require("pdfkit");

const d3 = require("d3");

const {
  AlignmentType,
  convertInchesToTwip,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  LevelFormat,
  Packer,
  PageBreak,
  Paragraph,
  TextRun,
  UnderlineType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
} = require("docx");

// const { multiValueLabelCSS } = require('react-select/src/components/MultiValue');

// const jsonwrite = require("./jsonwrite.js");
// import { arc } from "d3-shape"
// import { scaleLinear } from "d3-scale"
// import { format } from "d3-format"
// admin.initializeApp(functions.config().firebase);

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.


// exports.sendEmailConfirmation = functions.database.ref('/users/{uid}')
// Sends an email when data is submitted
//

exports.sendEmailConfirmation = functions.database.ref("/combinedusers/{uid}")
    .onWrite((change, context) => {
      const original = change.after.val();
      const shouldemail=original.shouldemail;
      // console.log("in function sendEmailConfirmation with shouldemail " + original.shouldemail);


      const userId=original.uid;
      let language=original.language == "pt-BR" ? "Portugese" : "English";
      if (shouldemail!=="yes" ) {
        console.log("Exiting sendEmailConfirmation");
      }
      if (shouldemail!=="yes" ) {
        return null;
      }

      // console.log("Continuing in sendEmailConfirmation");

      const nodemailer = require("nodemailer");
      // const admin = require('firebase-admin');
      // admin.initializeApp(); //seemed to work before this was added

      // const ABSPATH = path.dirname(process.mainModule.filename); // Absolute path to our app directory

      const PDFDocument = require("pdfkit");
      const fs = require("fs");
      const os = require("os");


      const gmailEmail = functions.config().gmail.email;
      const gmailPassword = functions.config().gmail.password;
      // Grab the current value of what was written to the Realtime Database.

      // const receiverID=original.id;  THIS SENT TO PERSON FILLING IN FORM
      //  NOW WANT JUST TO SEND TO ILESH
      // console.log('email to send to ' + receiverID);

      const receiverID= "abdul.fatir@assentian.com"; // "ilesh.dattani@assentian.com";
      const ccID="johnbighamgm@gmail.com";
      const companyName=original.company;
      const compName = companyName.toLowerCase()
          .replace(/(^|\s)\S/g, function(x) {
            return x.toUpperCase();
          });
      const userEmail = original.id;
      const userTelephoneNumber = original.telephoneNumber;
      const userName=capitalizeFirstLetter(original.username);

      // The os.tmpdir() method returns string spec. the os's default directory for temporary files.
      const path = require("path");
      const fileName=companyName.toUpperCase() +".pdf";
      const tempFilePath = path.join(os.tmpdir(), fileName);


      // console.log('DATA FROM PDF ' + companyName.toUpperCase() + '  '  + userName);

      // original.questionnaire is the questionnaire array


      const usersRef = admin.database().ref("/combinedusers/" + userId);
      // usersRef.update(cust);

      usersRef.update({shouldemail: "no"});

      const mailTransport = nodemailer.createTransport({
        host: "mail169.extendcp.co.uk",
        port: 465,
        secure: true,
        auth: {
          user: gmailEmail,
          pass: gmailPassword,
        },
      });

      // const mailTransport = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: gmailEmail,
      //     pass: gmailPassword,
      //   },
      // });

      const mailOptions = {
        from: gmailEmail,
        to: receiverID,
        cc: ccID,
        attachments: [{
          path: tempFilePath,
        }],
      };

      let text2; let subject;
      const customerLanguage=language;
      language="English"; // this overwites the language so that it is always English
      if (language==="English") {
        text2= "Dear  " + userName + ", \nThankyou for completing the questionnaire. Attached is the Risk Assessment for " + companyName + " If you have any questions please do not hesitate to contact me at : ilesh.dattani@assentian.com.  We will follow up within the next 7 days to discuss the issues identified in your risk assessment and help you identify the remedial actions required.\nBest Regards, \nDr Ilesh Dattani, \nAssentian Ltd.  \nTel: +44 7775598743 \nEmail: ilesh.dattani@assentian.com ";
        subject="Privacy and Data Security Assessment for " + capitalizeFirstLetter(companyName);
      }

      if (language==="Portugese") {
        text2= "Prezado " + userName + ", \nObrigado por preencher o questionário. Em anexo está a Avaliação de risco para" + companyName + ". Se você tiver alguma dúvida, não hesite em entrar em contato comigo: ilesh.dattani@assentian.com. Nos próximos sete dias, entraremos em contato para discutir os problemas identificados em sua avaliação de riscos e ajudá-lo a identificar as ações corretivas necessárias.  \nAtenciosamente, \nDr Ilesh Dattani, \nAssentian Ltd. \nTel: +44 7775598743 \nEmail: ilesh.dattani@assentian.com ";

        subject="Avaliação de Privacidade e Segurança de Dados para " + capitalizeFirstLetter(companyName);
      }

      mailOptions.subject = subject;
      mailOptions.text =text2;


      const q=JSON.parse(original.questionnaire);

      const dbBlocks= return_dbBlocks(language);
      const dbHeader= return_dbHeader(language);
      const dbFA= returnFA(language);
      const dbLA= returnLA(language);
      const dbPA= returnPA(language);
      const dbNA= returnNA(language);

      // console.error("Got dbPA   127" + dbPA)


      let titleToUse;
      if (language==="English") {
        titleToUse="Privacy and Data Security Report for " + companyName.toUpperCase();
      } else {
        titleToUse="Relatório de Privacidade e Segurança de Dados para " + companyName.toUpperCase();
      }
      // meta data
      // const pdf = new PDFDocument({
      //   bufferPages: true,
      //   size: "A4",
      //   info: {
      //     Title: titleToUse,
      //     Author: "I.Dattani",
      //   },
      // });

      const doc = new Document({
        creator: "I.Dattani",
        title: titleToUse,
        styles: {
          default: {
            heading1: {
              run: {
                size: 28,
                bold: true,
                font: "Times New Roman",
              },
              paragraph: {
                spacing: {
                  after: 120,
                },
              },
            },
            heading2: {
              run: {
                size: 26,
                bold: true,
                underline: {
                  type: UnderlineType.DOUBLE,
                  color: "FF0000",
                },
              },
              paragraph: {
                spacing: {
                  before: 240,
                  after: 120,
                },
              },
            },
          },
          paragraphStyles: [
            {
              id: "times",
              name: "Times",
              basedOn: "Normal",
              run: {
                size: 24,
                font: "Times New Roman",
              },
            },
            {
              id: "timesHeading",
              name: "Times",
              basedOn: "Normal",
              run: {
                size: 28,
                font: "Times New Roman",
              },
            },
            {
              id: "sectionHeading",
              name: "Times",
              basedOn: "Normal",
              run: {
                size: 32,
                bold: true,
                font: "Times New Roman",
              },
            },
          ],
        },
        numbering: {
          config: [
            {
              reference: "my-crazy-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.LOWER_LETTER,
                  text: "%1)",
                  alignment: AlignmentType.LEFT,
                },
              ],
            },
          ],
        },
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: fs.readFileSync("./logo1.png"),
                    transformation: {
                      width: 150,
                      height: 30.24,
                    },
                    floating: {
                      zIndex: 5,
                      horizontalPosition: {
                        relative: HorizontalPositionRelativeFrom.PAGE,
                        align: HorizontalPositionAlign.CENTER,
                      },
                      verticalPosition: {
                        relative: VerticalPositionRelativeFrom.PAGE,
                        align: VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),
              new Paragraph({
                text: "PRIVACY AND DATA SECURITY ASSESSMENT",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "The management of privacy  and data security requires organisations to completely reassess the way they approach data security and retention.  The risk assessment is your first step and gives you the understanding of what is required and to implement the necessary changes. In Europe, organisations that fail to comply with the new laws will face fines of up to €20 million or 4 percent of their annual turnover.",
                    style: "times",
                    break: 1,
                  }),
                ],
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                children: [
                  new TextRun("For support to implement the requirements from the Privacy and Data Security assessment please contact us at "),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: "Assentian Limited",
                        style: "Hyperlink",
                      }),
                    ],
                    link: "http://www.assentian.com",
                  }),
                  new PageBreak(),
                ],
                style: "times",
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                text: "OVERALL GUIDANCE FOR "+ companyName.toUpperCase(),
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "What data is being captured?",
                    style: "timesHeading",
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "The first step is to make an inventory of all of the personal data that you hold for everyone from employees to temps to contractors. That may seem daunting but this is why you should consider adopting e.g. a cloud based CoreHR SaaS solution as it can help facilitate compliance with good practice.",
                    style: "times",
                    alignment: AlignmentType.JUSTIFIED,
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "You need to review the data that you’re holding, decide whether it’s necessary (which would be a legal basis for processing) and assess how easily it can be accessed. In Europe, for example, under data protection regulations employees can demand to know if their personal data is being processed and where it's being held. Under data protection legislation; employers must be able to access, correct or delete employees’ personal data upon request and produce a digital copy if asked.",
                    style: "times",
                    alignment: AlignmentType.JUSTIFIED,
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "What is the lawful basis for processing the data?",
                    style: "timesHeading",
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Good practice expects data controllers (employers) have a valid legal basis for processing your employee’s data and sometimes to anticipate requirements. The legislation typically calls out 6 possible criteria (Consent, Contractual, Legal Obligation, Vital Interests, Public Tasks, Legitimate Interest) and you should be in a position to articulate which lawful basis is being applied to data being processed. If consent is being used as the basis for processing personal data, explicit consent needs to be captured from those employees.",
                    style: "times",
                    alignment: AlignmentType.JUSTIFIED,
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Where is it being stored?",
                    style: "timesHeading",
                    break: 1,
                  }),
                ],

              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Rights to privacy and data security will enhance employees'right to accesss and they have the right to seek 'confirmation as to whether or not personal data concerning them is being processed, where and for what purpose.' So you need to know where the data is being stored at all times, whether it is on site or being held by an outside contractor. \n\nThis is almost impossible if you are operating a paper-based system or utilising dated HR systems that aren’t fully-integrated. A SaaS (Software as a Service) option takes the challenge out of sourcing and accessing this information, ensuring that you remain compliant and prepared for potential SARs ( Subject Access Requests).",
                    style: "times",
                    alignment: AlignmentType.JUSTIFIED,
                    break: 1,
                  }),
                ],

              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "What security and access controls are in place?",
                    style: "timesHeading",
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "In a regulated environment security breaches have to be reported. So you need to have data breach policies in place.",
                    style: "times",
                    alignment: AlignmentType.JUSTIFIED,
                    break: 1,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "What retention policies are in place?",
                    style: "timesHeading",
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Data privacy and security compliance will require more transparency from employers about data retention policies. Human resource leaders need to ensure that any personal data is accurate, complete and up to date under the Data Quality Principle.\n\nYou must have defined policies and procedures in place for retaining personal data. Do you currently review your records and delete unnecessary personal data? If not, you'll need to start doing so.\n\nPersonal data should not be retained for any longer than necessary but ensure that you are meeting your legal requirements, which require certain HR records to be retained for a set period of time. Set data retention limits for ex-employees, unsuccessful job applicants or temporary workers.",
                    style: "times",
                    alignment: AlignmentType.JUSTIFIED,
                    break: 1,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "What internal audit function is applied to the data sets?",
                    style: "timesHeading",
                    break: 1,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Examine which operations and data sets will be affected by legislation. You need to fully understand existing and new regulations and ensure that you are constantly checking for updates. Some organisations may need to appoint a Data Protection Officer but every company should appoint a dedicated person or team to carry out a thorough internal audit.",
                    style: "times",
                    alignment: AlignmentType.JUSTIFIED,
                    break: 1,
                  }),
                  new PageBreak(),
                ],
              }),

              new Paragraph({
                children: [
                  new ImageRun({
                    data: fs.readFileSync("./logo1.png"),
                    transformation: {
                      width: 150,
                      height: 30.24,
                    },
                    floating: {
                      zIndex: 5,
                      horizontalPosition: {
                        relative: HorizontalPositionRelativeFrom.PAGE,
                        align: HorizontalPositionAlign.CENTER,
                      },
                      verticalPosition: {
                        relative: VerticalPositionRelativeFrom.PAGE,
                        align: VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),

              new Paragraph({
                text: companyName.toUpperCase(),
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),

              new Paragraph({
                text: "PRIVACY AND DATA SECURITY ASSESSMENT",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "User Details",
                    style: "timesHeading",
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: userName,
                    style: "times",
                  }),
                ],
                bullet: {
                  level: 0,
                },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: compName,
                    style: "times",
                  }),
                ],
                bullet: {
                  level: 0,
                },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: userEmail,
                    style: "times",
                  }),
                ],
                bullet: {
                  level: 0,
                },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: userTelephoneNumber,
                    style: "times",
                  }),
                ],
                bullet: {
                  level: 0,
                },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Section 1 "+dbBlocks[0]["blockHeader"],
                    style: "sectionHeading",
                    break: 1,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),


              new Paragraph({
                children: [
                  new TextRun({
                    text: "Q1. Has your organisation established a Data Protection and Privacy (DPP) Governance Framework?",
                    style: "timesHeading",
                    break: 1,
                  }),
                ],
                alignment: AlignmentType.JUSTIFIED,
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Ans. 100% Complete",
                    style: "times",
                    break: 1,
                  }),
                ],
                alignment: AlignmentType.JUSTIFIED,
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Your enterprise is well-prepared in this area. Where appropriate, the governance framework should reference existing policies and procedures that are linked to personal data processing (for example, the information security policy or the identity and access management policy). Likewise, organisational and technical concepts, a governance framework and arrangements should be referenced to ensure consistency (for instance, any existing data classification schemes or the determination of information asset protection levels).",
                    style: "times",
                    break: 1,
                  }),
                ],
                alignment: AlignmentType.JUSTIFIED,
              }),
            ],
          },
        ],
      });

      //* ************NOW FOR THE QUESTIONS***********************************************************

      pdf.addPage();
      pdf.image("logo1.png", 72, 72, {width: 150});
      pdf.moveDown();
      pdf.fontSize(20);
      pdf.font("Times-Bold");
      pdf.text(companyName.toUpperCase(), {align: "center"});
      pdf.moveDown();
      if (language==="English") {
        pdf.text("PRIVACY AND DATA SECURITY ASSESSMENT", {
        // lineBreak:false,
          align: "center",
          // continued: true
        });
      } else {
        pdf.text("AVALIAÇÃO DA PRIVACIDADE E DA SEGURANÇA DE DADOS", {
        // lineBreak:false,
          align: "center",
        // continued: true
        });
      }
      // .image('logo1.png', {
      //             fit: [120, 360],
      //                 continued: false
      //          })

      pdf.moveDown();

      pdf.fontSize(16).font("Times-Bold").text("User Details").moveDown().list([userName, compName, userEmail, userTelephoneNumber], {align: "justify"});

      pdf.moveDown();

      pdf.text(" ", 72), { };

      //* ************************************************************
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 1 "+dbBlocks[0]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[0]["blockBody"], {
        align: "justify",
      });
      let i;
      for ( i=0; i<7; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }
      //* ************************************************************
      pdf.addPage();
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 2 "+dbBlocks[1]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[1]["blockBody"], {
        align: "justify",
      });

      for ( i=7; i<13; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }
      //* ************************************************************

      pdf.addPage();
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 3 "+dbBlocks[2]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[2]["blockBody"], {
        align: "justify",
      });

      for ( i=13; i<17; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }

      //* ************************************************************
      pdf.addPage();
      pdf.fontSize(14);
      pdf.font("Times-Bold");
      pdf.text("Section 4 "+dbBlocks[3]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[3]["blockBody"], {
        align: "justify",
      });

      for ( i=17; i<23; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }
      //* ************************************************************
      pdf.addPage();
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 5 "+dbBlocks[4]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[4]["blockBody"], {
        align: "justify",
      });

      for ( i=23; i<28; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }

      //* ************************************************************
      pdf.addPage();
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 6 "+dbBlocks[5]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[5]["blockBody"], {
        align: "justify",
      });

      for ( i=28; i<32; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }
      //* ************************************************************
      pdf.addPage();
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 7 "+dbBlocks[6]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[6]["blockBody"], {
        align: "justify",
      });

      for ( i=32; i<35; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }
      //* ************************************************************
      pdf.addPage();
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 8 "+dbBlocks[7]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[7]["blockBody"], {
        align: "justify",
      });

      for ( i=35; i<40; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }

      //* ************************************************************
      pdf.addPage();
      pdf.fontSize(16);
      pdf.font("Times-Bold");
      pdf.text("Section 9 "+dbBlocks[8]["blockHeader"], {
        align: "center",
      });
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.font("Times-Roman");
      pdf.text(dbBlocks[8]["blockBody"], {
        align: "justify",
      });

      for ( i=40; i<46; i++) {
        addQuestionAnswerDetail(pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA);
      }

      //* ******************************************************************************************************************
      // see the range of buffered pages
      const range = pdf.bufferedPageRange();

      for ( i=range.start; i<(range.start + range.count); i++) {
        pdf.switchToPage(i);
        pdf.text("Page " +(i + 1)+" of " + range.count, 264,
            pdf.page.height - 40,
            {height: 25, width: 100});
      }
      // pdf.flushPages();
      // manually flush pages that have been buffered
      // pdf.flushPages()

      // or, if you are at the end of the document anyway,
      // pdf.end() will call it for you automatically.
      // Close PDF and write file.


      // Stream contents to a file
      pdf.pipe(
          fs.createWriteStream(tempFilePath),
      )
          .on("finish", () =>{
            // console.log('Have written all data to file ' + fileName);
            // If autoClose is set to true (default behavior) on 'error' or 'finish' the file descriptor will be closed automatically

            return mailTransport.sendMail(mailOptions, (error, info)=>{
              if (error) {
                return console.log("send mail error  ", error);
              } else {
                fs.unlink(tempFilePath, (err) => {
                  if (err) {
                    console.log("Failed to delete temp file:"+err);
                  } else {
                    console.log("Successfully deleted temp file");
                  }
                  // return null;
                });


                return console.log("Email sent  "+ info.response);
              }
            });
          });
      // Close PDF and write file.
      pdf.end();


      return null;
    });


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const addQuestionAnswerDetail = (pdf, q, i, dbHeader, dbFA, dbLA, dbPA, dbNA) => {
  let ans = q[i] == 1 ? "100% Complete": (q[i] == 2 ? "50% - 99% Complete" : (q[i] == 3 ? "10% - 49% Complete": "0% - 9% Complete"));
  pdf.fontSize(14);
  pdf.moveDown();
  let qNum = i;
  pdf.text("Q"+(++qNum)+".  "+dbHeader[i], {
    align: "justify",
  });

  pdf.moveDown();
  pdf.fontSize(12);
  pdf.text("Ans. "+ans);

  pdf.moveDown();
  pdf.fontSize(12);
  // console.log("q[i]  " + q[i]+ " i=  " +i)
  pdf.text(choiceToAnswer(q[i], i, dbFA, dbLA, dbPA, dbNA), {align: "justify"});
};

function choiceToAnswer(c, qi, dbFA, dbLA, dbPA, dbNA ) {// NB here qi is question number -1
  // assert(1<=c<=4);
  // ("c   "+c)
  // console.log("qi   "+qi)
  // console.error ("dbPA[qi]   "+ dbPA[qi])
  if (c===1) return dbFA[qi];
  if (c===2) return dbLA[qi];
  if (c===3) return dbPA[qi];
  if (c===4) return dbNA[qi];
  return 0;
}

//* ***************************************************************************************
//
// NOW SECURITY
//
//* ****************************************************************************** */
exports.sendEmailConfirmationSecurity = functions.database.ref("/combinedusers/{uid}")
    .onUpdate( async (change, context) => {
      /* const before = change.before.val();*/ // DataSnapshot before the change
      const after = change.after.val(); // DataSnapshot after the change
      const companyName=after.company;
      const compName = companyName.toLowerCase()
          .replace(/(^|\s)\S/g, function(x) {
            return x.toUpperCase();
          });
      const userEmail = after.id;
      const userTelephoneNumber = after.telephoneNumber;
      // console.log("in function sendEmailConfirmationSecurity ");

      // console.log( 'before.latestscore ' + before.latestscore)
      // console.log( 'after.latestscore ' + after.latestscore)

      // console.log("shouldemailSecurity  is" +after.shouldemailSecurity)
      if (after.shouldemailSecurity!=="yes" || after.scoreSecurity === undefined ) return null;
      // if (before.latestscore!=="none submitted" && after.latestscore==="none submitted") return null;

      // console.log("Continuing in sendEmailConfirmationSecurity")

      const nodemailer = require("nodemailer");

      /* const PDFDocument = require("pdfkit");*/
      const fs = require("fs");
      const os = require("os");

      let table0;

      const gmailEmail = functions.config().gmail.email;
      const gmailPassword = functions.config().gmail.password;

      const ccID="johnbighamgm@gmail.com"; // 'ilesh.dattani@assentian.com';

      // Grab the current value of what was written to the Realtime Database.

      // let receiverID = after.id;  //this is the email address of who filled in the questionnaire
      // console.log('email to send to ' + receiverID);
      const receiverID = "ilesh.dattani@assentian.com";

      const userId=after.uid;
      // console.log('User  uid !  705 ' + userId);


      const username= after.username;
      // let language=after.language;

      // let scoreSecurity= after.scoreSecurity


      const path = require("path");
      const fileName=companyName.toUpperCase() +".pdf";
      const tempFilePath = path.join(os.tmpdir(), fileName);

      const mailTransport = nodemailer.createTransport({
        host: "mail169.extendcp.co.uk",
        port: 465,
        secure: true,
        auth: {
          user: gmailEmail,
          pass: gmailPassword,
        },
      });

      // const mailTransport = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: gmailEmail,
      //     pass: gmailPassword,
      //   },
      // });

      const mailOptions = {
        from: gmailEmail,
        to: receiverID,
        cc: "johnbighamgm@gmail.com",
        // 'johnbighamgm@gmail.com, ilesh.dattani@assentian.com'
        // bcc:ccID,
        attachments: [{
          path: tempFilePath,
        }],
      };

      // let username;
      let capitalised;


      // const userName=capitalizeFirstLetter(original.username);

      // var userId = admin.auth().currentUser.uid; //This is the firebase unique user ID


      const usersRef = admin.database().ref("/combinedusers/" + userId);
      // usersRef.update(cust);

      usersRef.update({shouldemailSecurity: "no"});

      const q_P=["Quantos funcionários trabalham na sua organização?",
        "Qual categoria melhor define o setor principal da sua organização?",
        "Você tem um processo de administração de usuários para novos funcionários e para deixar funcionários?",
        "Os privilégios de usuário são revisados?",
        "As senhas complexas são aplicadas dentro da organização?",
        "Funcionários, indivíduos ou terceiros têm acesso remoto à sua rede?",
        "Você realiza treinamento de conscientização de segurança?",
        "Os laptops dos funcionários são criptografados?",
        "Os backups são armazenados remotamente e, em caso afirmativo, estão adequadamente protegidos?",
        "Os patches são instalados em tempo hábil?",
        "Você tem uma rede corporativa sem fio?",
        "Você tem uma rede de convidados sem fio? ",
        "Você tem políticas de segurança e privacidade?",
        "Você tem uma função de segurança em sua organização? ",
        "Você tem um plano de resposta e recuperação de incidentes?",
        "Você tem um antivírus?",
        "Você protege seu ambiente com um firewall?",
        "Você executa verificações internas de vulnerabilidade?",
        "No ano passado, sua organização foi vítima de um ataque cibernético?",
        "Em comparação com esse período do ano passado, você está mais ou menos confiante na capacidade da sua organização de responder a um incidente de segurança cibernética e se recuperar de quaisquer impactos negativos associados?",
        "Sua organização possui seguro cibernético?",
      ];
      const ans_P=[["1 a 49", "50 a 199 ", "200 a 499", "500 a 1999", "2000 a 4999", "5000 ou mais"],

        ["Construção", "Serviços de electricidade, gás, água e resíduos", "Serviços financeiros e de seguros", "Cuidados de saúde e assistência social", "Meios de informação e telecomunicações", "Fabricação", "Serviços profissionais, científicos e técnicos", "Público, sem fins lucrativos", "Aluguer, aluguer e serviços imobiliários", "Varejo", "Transportes postais e entrepostos", "De outros"],

        ["Não", "Sim, mas não documentado", "Um processo formalmente documentado"],

        ["Não", "As análises são realizadas ad hoc", "Somente contas de administrador são revisadas", "Todos os privilégios de usuário são monitorados periodicamente"],

        ["Não", "Menos de 8 caracteres e nenhum outro requisito", "8 caracteres ou mais, caracteres especiais, maiúsculas e minúsculas, números e alterações necessárias periodicamente", "Autenticação multifatorial"],

        ["Não", "Continuamente sem monitoramento ou ferramentas", "Ferramentas de acesso remoto para acessar a rede corporativa de fora", "Facilitado via VPN"],

        ["Não", "Apenas para novos funcionários", "Para todos os funcionários periodicamente", "Obrigatório para todos os funcionários e gerência, periodicamente, com avaliação de entendimento"],

        ["Não criptografado", "Criptografia de arquivo", "Criptografia do disco rígido", "Criptografia completa e nenhum dado armazenado localmente"],

        ["Não armazenado remotamente", "Sim, mas fisicamente inseguro", "Sim, mas não criptografado", "Sim, criptografado"],

        ["Não monitorado", "Patches são instalados em uma base ad-hoc", "Existe um processo formal de gerenciamento de patches que cobre servidores, clientes e dispositivos de segurança"],

        ["SSID publicado com senha fraca", "SSID publicado com senha complexa", "SSID oculto, senha complexa (+ medidas adicionais)"],

        ["Sim", "Sim, totalmente isolado, sem acesso à rede interna", "Não", "Não, os hóspedes se conectam à nossa rede corporativa"],

        ["Não", "Na prateleira", "Aprovado pelo conselho, treinado, assinado por funcionários, aplicado"],

        ["Não", "Funções de segurança dentro da equipe técnica / de TI", "Equipe de segurança dedicada"],

        ["Não", "Nossa equipe de resposta opera entre o horário comercial", "Nossa equipe de resposta está em prontidão 24 horas por dia, 7 dias por semana, com uma resposta imediata quando necessário"],

        ["Não", "Instalado nos computadores dos funcionários", "Instalado em todos os computadores e servidores", "Proteção avançada de ponto final"],

        ["Não", "Firewall de nível residencial", "Cada ponto de entrada / saída de rede possui um firewall de nível comercial suportado pelo fornecedor", "Cada ponto de entrada / saída de rede possui um firewall de nível comercial suportado pelo fornecedor e as configurações são revisadas periodicamente"],

        ["Não", "Ad hoc", "Verificações de vulnerabilidades internas estão sendo executadas em todos os sistemas pelo menos uma vez por ano", "Teste de penetração anual é realizado"],

        ["Sim", "Não", "Eu não sei", "Prefiro não divulgar essas informações"],

        ["Mais confiante", "Menos confiante", "Não há diferença no nível de confiança", "Não sei / prefiro não dizer"],

        ["Não - não tínhamos conhecimento desse tipo de seguro", "Não - não sentimos que precisamos", "Não - acreditamos que esse risco é coberto por outras apólices de seguro que temos", "Não - nós nos auto-seguramos", "Ainda não - estamos considerando", "Sim - temos uma política cibernética autônoma", "Sim - temos isso coberto como uma extensão para outra apólice de seguro", "Sim - mas não sei como a política foi organizada", "Não sei / prefiro não dizer"],

      ];


      const q_E=["How many employees work at your organisation?",
        "Which category best defines your organisation’s primary industry?",
        "Does your organisation have a user administration process for new employees and leaving employees?",
        "Does your organisation review user privileges?",
        "Are complex passwords enforced within the organisation?",
        "Do employees, individuals or third parties have remote access to your network?",
        "Does your organisation provide security awareness training?",
        "Are the laptops/desktops of employees encrypted?",
        "Are backups stored remotely, and if so are they properly protected?",
        "Are patches installed on a timely basis?",
        "Does your organisation have a wireless corporate network?",
        "Does your organisation have a wireless guest network?",
        "Does your organisation have security & privacy policies?",
        "Does your organisation have a security function?",
        "Does your organisation have an incident response and recovery plan?",
        "Does your organisation have an anti-virus?",
        "Does your organisation protect its environment with a firewall?",
        "Does your organisation perform internal vulnerability scans?",
        "Was your organisation in the past year a victim of a cyber attack?",
        "Compared to this time last year, are you more or less confident in the ability of your organisation to respond to a cyber security incident and recover from any associated negative impacts?",
        "Does your organisation have cyber insurance?",
      ];

      const ans_E=[["1 to 49", "50 to 199", "200 to 499", "500 to 1999", "2000 to 4999", "5000 or more"],

        ["Construction", "Electricity, gas, water and waste services", "Financial and insurance services", "Healthcare and social assistance", "Information and telecommunications", "Manufacturing", "Professional, scientific and technical services", "Public, non-profit", "Rental, hiring and real estate services", "Retail", "Transport, postal and warehousing", "Other"],

        ["No", "Yes, but not documented", "A formally documented process"],

        ["No", "Reviews are performed on an ad-hoc basis", "Only administrator accounts are reviewed", "All user privileges are monitored on a periodic basis"],

        ["No", "Less than 8 characters and no other requirements", "8 characters or more, special characters, upper and lower case, numbers and required to change on a periodic basis", "Multi-factor authentication"],

        ["No", "Continuously without monitoring or tools", "Remote access tools to access the corporate network from outside", "Facilitated via VPN"],

        ["No", "Only for new employees", "For all employees on a periodic basis", "Mandatory for all employees and management, periodically, with assessment of understanding"],

        ["Unencrypted", "File encryption", "Hard Drive encryption", "Full encryption and no data stored locally"],

        ["Not stored remotely", "Yes, but physically insecure", "Yes, but unencrypted", "Yes, encrypted"],

        ["Not monitored", "Patches are installed on an ad-hoc basis", "A formal patch management process is in place and covers servers, clients and security devices"],

        ["Published SSID with weak password", "Published SSID with complex password", "Hidden SSID, complex password (+ additional measures)"],

        ["Yes", "Yes, fully isolated with no access to internal network", "No", "No, guests connect to our corporate network"],

        ["No", "On-the-shelf", "Approved by the board, trained, signed by employees, applied"],

        ["No", "Security functions within the technical/IT team", "Dedicated security team"],

        ["No", "Our response team operates between business hours", "Our response team is on call 24 hours a day, 7 days a week, with an immediate response when needed"],

        ["No", "Installed on employees' computers", " Installed on all computers and servers", "Advanced End-Point Protection"],

        ["No", "Residential grade firewall", "Each network entry and exit point has a vendor supported commercial level firewall", "Each network entry and exit point has a vendor supported commercial level firewall and the settings are periodically reviewed."],

        ["No", "Ad hoc", "Internal vulnerability checks are running on all systems at least once  a year", "Annual penetration testing is performed."],

        ["Yes", "No", "I don't know", "I prefer not to disclose this information"],

        ["More confident", "Less confident", "There is no difference in confidence level", "I don't know / prefer not to say"],

        ["No - we were not aware of this type of insurance", "No - we do not feel we need it", "No - we believe that this risk is covered by other insurance policies we have", "No - we insure ourselves", "Not yet - we are considering", "Yes - we have an autonomous cyber policy", "Yes - we have it covered as an extension to another insurance policy", "Yes - but I don't know how the policy was organized", "I don't know / prefer not to say"],
      ];


      usersRef.once("value").then(async (snapshot) => { //  GETTING THE DATA FOR THE SUBMISSION
        const data2= snapshot.val();
        // let username= data2.username;
        let language=data2.language === "pt-BR" ? "Portugese": "English";
        let subject;
        // console.log("Language in email    " + language)

        capitalised=capitalizeFirstLetter(username);

        //    q     ["2","3","0","2","2","1","1","2","1","2","0","1","0","1","0","0","1","1","1","0","4"]
        const q=JSON.parse(data2.historySecurity);
        // const q=data2.historySecurity;
        // console.log("    q     "   +  q)

        let textEmail;
        const customerLanguage=language;
        language="English"; // Overwites the language so always English
        if (language==="English") {
          textEmail= "Dear  " + capitalised + ", \nThank you for completing the security assessment today. Your total score is " + after.scoreSecurity +" %. If you have any questions please do not hesitate to contact me at : ilesh.dattani@assentian.com.  We will follow up within the next 7 days to discuss the issues identified in your risk assessment and help you identify the remedial actions required. In the meantime please look at the general advice below. \nBest Regards, \nDr Ilesh Dattani, \nAssentian Ltd  \nTel: +44 7775598743 \nEmail: ilesh.dattani@assentian.com ";


          subject="The Security Assessment Score " + companyName.toUpperCase();
        }

        if (language==="Portugese") {
          textEmail= "Prezado " + capitalised + ", \nObrigado por concluir a avaliação de segurança hoje. Sua pontuação total é de" + after.scoreSecurity + "%. Se você tiver alguma dúvida, não hesite em entrar em contato comigo: ilesh.dattani@assentian Nos próximos sete dias, entraremos em contato para discutir os problemas identificados em sua avaliação de riscos e ajudá-lo a identificar as ações corretivas necessárias. \n Atenciosamente, \nDr Ilesh Dattani, \nAssentian Ltd \nTel: +44 7775598743 \nE-mail : ilesh.dattani@assentian.com";

          subject="Sua pontuação de avaliação de segurança";
        }

        mailOptions.subject = subject;
        mailOptions.text =textEmail;


        //* *************NOW FOR THE PDF********************

        const score=parseFloat(after.scoreSecurity);
        const risk=100-parseFloat(after.scoreSecurity);
        let whatToWrite;
        let gaugeText = "";


        const gImage= after.gImage;

        if (language==="English") {
          if ( score<20) {
            whatToWrite="The Risk exposure of the organisation " + companyName.toUpperCase()+ " is deemed high with a risk assessment of " +risk + "%. The organisation are essentially 'Non-Existent' with no evidence of actions taken to prevent a cyber-attack or data breech from taking place";
            gaugeText = "The level of maturity of your organization is almost non-existent. You need to quickly begin to address even the most basic steps. The report that will be sent by email will describe the areas where you can improve immediately and the services we can offer to help.";
          }
          if (score>=20 && score<40) {
            whatToWrite="The Risk exposure of the organisation "+ companyName.toUpperCase() + " is deemed high with a risk assessment of " + risk +"%. The organisation has some very basic measures in place and has a basic awareness of the threats they face. This will not prevent any cyber-attack or data breach from occurring.";
            gaugeText = "Your organization's maturity level is Basic. Although you thought about security, let's be frank. Your score indicates serious vulnerabilities. The report that will be sent by email will describe areas where immediate improvements can be made and the services we can offer to help.";
          }
          if (score>=40 && score<60) {
            whatToWrite="The Risk exposure of the organisation "+ companyName.toUpperCase() + " is deemed significant with a risk assessment of " + risk +"%. The score indicates that security has been thought about, but several problems need to be solved. The organization's maturity level is Prudence.  The report that will be sent by email will describe areas where immediate improvements can be made and the services we can offer to help.";
            gaugeText = "Your organization's maturity level is Prudence. The score indicates that you thought about security, but several problems need to be solved. The report that will be sent by email will describe areas where immediate improvements can be made and the services we can offer to help.";
          }
          if (score>=60 && score<85) {
            whatToWrite="The Risk exposure of the organisation "+ companyName.toUpperCase() + " is deemed moderate with a risk assessment of " + risk +"%. The organization's maturity level is Diligence.  According to their responses, most of the elementary and some advanced measures are in place. Does this mean that the organization is able to respond to all cyber attacks? Probably no.  We can help you achieve best practices. The report that will be sent by email will describe areas where immediate improvements can be made and the services we can offer to help.";
            gaugeText = "Your organization's level of maturity is Diligence. You are on the right track! According to their responses, most of the elementary and some advanced measures are in place. Does this mean that your organization is able to respond to all cyber attacks? Probably not, but we can help you achieve best practices. The report that will be sent via email will describe areas where immediate improvements can be made and the services we can offer to help.";
          }
          if (score>=85 ) {
            whatToWrite="The Risk exposure of the organisation "+ companyName.toUpperCase() + " is low with a risk assessment of " + risk +"%. Your organization's level of maturity is a best practice. The score indicates that the company has thought a lot about security, but several problems can still be solved. The report that will be sent by email will suggest how to resolve them.";
            gaugeText = "Your organization's level of maturity is a Best Practice. The score indicates that you thought a lot about security, but several problems can still be solved. The report that will be sent by email will suggest how to resolve them and services that we can offer to help.";
          }
        } else {
          if ( score<20) {
            whatToWrite = "A exposição ao risco da organização" + companyName.toUpperCase() + "é considerada alta com uma avaliação de risco de " + risk + "%. A organização é essencialmente 'inexistente' sem evidência de ações tomadas para impedir que um ataque cibernético ou culatra de dados ocorra ";
            gaugeText = "O nível de maturidade da sua organização é quase inexistente. Você precisa começar rapidamente a abordar até as etapas mais básicas. O relatório que será enviado por e-mail descreverá as áreas em que é possível melhorar imediatamente e os serviços que podemos oferecer para ajudar.";
          }
          if (score>=20 && score<40) {
            whatToWrite = "A exposição ao risco da organização" + companyName.toUpperCase() + "é considerada alta com uma avaliação de risco de " + risk + "%. A organização possui algumas medidas básicas e tem um conhecimento básico do ameaças que enfrentam. Isso não impedirá a ocorrência de qualquer ataque cibernético ou violação de dados. ";
            gaugeText = "O nível de maturidade da sua organização é Básico. Embora você tenha pensado em segurança, vamos ser francos. Sua pontuação indica sérias vulnerabilidades. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitas e os serviços que podemos oferecer para ajudar.";
          }
          if (score>=40 && score<60) {
            whatToWrite = "A exposição ao risco da organização" + companyName.toUpperCase() + "é considerada significativa com uma avaliação de risco de " + risk + "%. A pontuação indica que a segurança foi pensada, mas vários problemas precisam ser resolvidos. O nível de maturidade da organização é Prudence. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitas e os serviços que podemos oferecer para ajudar. ";
            gaugeText = "O nível de maturidade da sua organização é Prudence. A pontuação indica que você pensou em segurança, mas vários problemas precisam ser resolvidos. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitas e os serviços que podemos oferecer para ajudar.";
          }
          if (score>=60 && score<85) {
            whatToWrite = "A exposição ao risco da organização" + companyName.toUpperCase() + "é considerada moderada com uma avaliação de risco de " + risk + "%. O nível de maturidade da organização é Diligência. De acordo com as respostas, a maioria das e algumas medidas avançadas estão em vigor. Isso significa que a organização pode responder a todos os ataques cibernéticos? Provavelmente não. Podemos ajudá-lo a alcançar as melhores práticas. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitos e os serviços que podemos oferecer para ajudar. ";
            gaugeText = "O nível de maturidade da sua organização é Diligence. Você está no caminho certo! De acordo com suas respostas, a maioria das medidas elementares e algumas avançadas estão em vigor. Isso significa que sua organização é capaz de responder a todos os ataques cibernéticos? Provavelmente não, mas podemos ajudá-lo a alcançar as melhores práticas. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitas e os serviços que podemos oferecer para ajudar.";
          }
          if (score>=85 ) {
            whatToWrite = "A exposição ao risco da organização" + companyName.toUpperCase() + "é baixa com uma avaliação de risco de " + risk + "%. O nível de maturidade da sua organização é uma prática recomendada. A pontuação indica que a empresa possui pensou muito em segurança, mas vários problemas ainda podem ser resolvidos. O relatório que será enviado por email sugerirá como resolvê-los. ";
            gaugeText = "O nível de maturidade da sua organização é uma prática recomendada. A pontuação indica que você pensou muito em segurança, mas vários problemas ainda podem ser resolvidos. O relatório que será enviado por email sugerirá como resolvê-los.";
          }
        }
        let test;
        if (language==="English") {
          test = "A COMPLETE NETWORK VULNERABILITY TEST IS RECOMMENDED TO DISCOVER WHAT SPECIFIC VULNERABILITIES LEAVE THIS ORGANIZATION EXPOSED TO BETTER UNDERSTAND RISK EXPOSURE";
        } else {
          test = "É RECOMENDADO UM TESTE DE VULNERABILIDADE EM REDE COMPLETA PARA DESCOBRIR QUE VULNERABILIDADES ESPECÍFICAS DEIXAM ESTA ORGANIZAÇÃO EXPOSTA PARA MELHOR COMPREENDER A EXPOSIÇÃO DE RISCOS";
        }
        let classifyText;
        if (language==="English") {
          classifyText="We classify different levels of preparedness as Non-existent, Basic, Prudence, Diligence and Best Practice. Different facets of security management are numbered below and at the outset if your score is low it is recommended that you focus on the facets nearer the top of the list. Even those organisations with the highest scores should benefit considerably from emerging tools for threat detection related to network visibility, detection and response and analytics tools that give security teams better insight into their network activity. These tools seek to surpass legacy techniques and provide more realistic insight into malicious activity within the environment. They form an evolution from established techniques such as network anomaly detection techniques instrumental in uncovering worms, to more recent applications of behaviour analytics to identify ransomware and tackle high-profile (and high-impact) attacks.";
        } else {
          classifyText = "Classificamos diferentes níveis de preparação como Inexistentes, Básicos, Prudência, Diligência e Melhores Práticas. Diferentes facetas do gerenciamento de segurança são numeradas abaixo e, no início, se sua pontuação for baixa, é recomendável que você se concentre nas facetas Mesmo as organizações com as pontuações mais altas devem se beneficiar consideravelmente das ferramentas emergentes para detecção de ameaças relacionadas à visibilidade da rede, detecção e resposta e ferramentas de análise que proporcionam às equipes de segurança uma melhor compreensão de suas atividades na rede. técnicas legadas e fornecem uma visão mais realista das atividades mal-intencionadas no ambiente.Eles formam uma evolução, desde técnicas estabelecidas, como técnicas de detecção de anomalias de rede, instrumentais na descoberta de worms, até aplicações mais recentes de análise de comportamento, para identificar ransomware e lidar com alto perfil (e alto ataques de impacto) .";
        }

        let titleToUse;
        if (language==="English") {
          titleToUse="System Security Report for " + companyName.toUpperCase();
        } else {
          titleToUse="Relatório de Segurança do Sistema para " + companyName.toUpperCase();
        }
        // meta data
        const pdf = new PDFDocumentWithTables({
          bufferPages: true,
          size: "A4",
          info: {
            Title: titleToUse,
            Author: "I.Dattani",
          },
        });

        // LOGO
        pdf.image("logo1.png", 72, 72, {width: 150});


        // LOGO
        pdf.moveDown(2);// pdf.image(gImage,72, 72,{width:150});

        // pdf.image('logo1.png', {
        //            fit: [72, 400]})
        pdf.moveDown(2);
        // HEADER
        pdf.font("Times-Bold");
        pdf.fontSize(14);

        if (language==="English") {
          pdf.text("SYSTEM SECURITY ASSESSMENT", {
            // lineBreak:false,
            align: "center",
            // continued: true
          });
        } else {
          pdf.text("AVALIAÇÃO DA SEGURANÇA DO SISTEMA", {
            // lineBreak:false,
            align: "center",
            // continued: true
          });
        }
        // .image('logo1.png', {
        //             fit: [120, 360],
        //                 continued: false
        //          })


        pdf.moveDown();


        pdf.text(" ", 72), { };


        pdf.fontSize(12);
        pdf.font("Times-Roman");

        pdf.text(whatToWrite);

        // 99999999999999999999999999999999999999999


        // 999999999999999999999999999999999999999
        // 00000000000000000000000000000000000000


        pdf.addPage();
        const min = 0; const max = 100; const value = 50;
        const backgroundArc = d3.arc()
            .innerRadius(0.65)
            .outerRadius(1)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2)
            .cornerRadius(1);

        const arcPath = backgroundArc();

        const percentScale = d3.scaleLinear().domain([min, max]).range([0, 1]);

        const percent = percentScale(value);

        const angleScale = d3.scaleLinear()
            .domain([0, 1])
            .range([-Math.PI / 2, Math.PI / 2])
            .clamp(true);

        const angle = angleScale(percent);

        const filledArc = d3.arc()
            .innerRadius(0.65)
            .outerRadius(1)
            .startAngle(-Math.PI / 2)
            .endAngle(angle)
            .cornerRadius(1)();

        const colorScale = d3.scaleLinear().domain([0, 1]).range(["#dbdbe7", "#4834d4"]);

        const gradientSteps = colorScale.ticks(10).map((value) => colorScale(value));

        const markerLocation = getCoordsOnArc(angle, 1 - (1 - 0.65) / 2);
        // d is a string containing a series of path commands that define the path to be drawn.
        // pdf.path(
        //    // fillAndStroke("#dbdbe7", "#900"),
        //    arcPath/toString())
        // style="transform: translate(50%, 50%)" )
        //    .stroke();

        /*
pdf.path( fillColor="url(#Gauge__gradient)",d=filledArc )

pdf.line (y1="-1", y2="-0.65", stroke="white", strokeWidth="0.027" )
pdf.circle(
    cx=markerLocation[0],
    cy=markerLocation[1],
    r="0.2".
    stroke="#2c3e50",
    strokeWidth="0.01",
    fillColor=colorScale(percent)
)
pdf.path(
    d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z" ,
    transform=`rotate(${
      angle * (180 / Math.PI)
    }) translate(-0.2, -0.33)` ,
    fillColor="#6a6a85"
)
 */

        // pdf.image(`images/${risk}.png`, 180, 200, {width: 250, height: 200, align: "center", valign: "center"});
        pdf.moveDown();
        pdf.text(gaugeText);

        pdf.addPage();


        {/* 777777777777777777777777777777777777777777777777777 */}


        pdf.moveDown();

        pdf.text(test);
        pdf.moveDown();
        pdf.text(classifyText);
        pdf.moveDown();
        pdf.text("User Details").moveDown().list([capitalised, compName, userEmail, userTelephoneNumber], {align: "justify"});
        pdf.moveDown();
        //* ********************* */
        //    q     ["2","3","0","2","2","1","1","2","1","2","0","1","0","1","0","0","1","1","1","0","4"]

        // console.log("  q[0]  " + q[0] + "  " + parseInt(q[0],10)  + "   q[1]  "   + q[1] + "  " + parseInt(q[0],10) )
        const table_P = {
          headers: ["Questão", "Responda"],
          rows: [
            [q_P[0], ans_P[0][parseInt(q[0], 10)]],
            [q_P[1], ans_P[1][parseInt(q[1], 10)]],
            [q_P[2], ans_P[2][parseInt(q[2], 10)]],
            [q_P[3], ans_P[3][parseInt(q[2], 10)]],
            [q_P[4], ans_P[4][parseInt(q[2], 10)]],
            [q_P[5], ans_P[5][parseInt(q[2], 10)]],
            [q_P[6], ans_P[6][parseInt(q[6], 10)]],
            [q_P[7], ans_P[7][parseInt(q[7], 10)]],
            [q_P[8], ans_P[8][parseInt(q[8], 10)]],
            [q_P[9], ans_P[9][parseInt(q[9], 10)]],
            [q_P[10], ans_P[10][parseInt(q[19], 10)]],
            [q_P[11], ans_P[11][parseInt(q[11], 10)]],
            [q_P[12], ans_P[12][parseInt(q[12], 10)]],
            [q_P[13], ans_P[13][parseInt(q[13], 10)]],
            [q_P[14], ans_P[14][parseInt(q[14], 10)]],
            [q_P[15], ans_P[15][parseInt(q[15], 10)]],
            [q_P[16], ans_P[16][parseInt(q[16], 10)]],
            [q_P[17], ans_P[17][parseInt(q[17], 10)]],
            [q_P[18], ans_P[18][parseInt(q[18], 10)]],
            [q_P[19], ans_P[19][parseInt(q[19], 10)]],
            [q_P[20], ans_P[20][parseInt(q[20], 10)]],
          ],
        };

        const table_E = {
          headers: ["Question", "Answer"],
          rows: [
            [q_E[0], ans_E[0][parseInt(q[0], 10)]],
            [q_E[1], ans_E[1][parseInt(q[1], 10)]],
            [q_E[2], ans_E[2][parseInt(q[2], 10)]],
            [q_E[3], ans_E[3][parseInt(q[2], 10)]],
            [q_E[4], ans_E[4][parseInt(q[2], 10)]],
            [q_E[5], ans_E[5][parseInt(q[2], 10)]],
            [q_E[6], ans_E[6][parseInt(q[6], 10)]],
            [q_E[7], ans_E[7][parseInt(q[7], 10)]],
            [q_E[8], ans_E[8][parseInt(q[8], 10)]],
            [q_E[9], ans_E[9][parseInt(q[9], 10)]],
            [q_E[10], ans_E[10][parseInt(q[19], 10)]],
            [q_E[11], ans_E[11][parseInt(q[11], 10)]],
            [q_E[12], ans_E[12][parseInt(q[12], 10)]],
            [q_E[13], ans_E[13][parseInt(q[13], 10)]],
            [q_E[14], ans_E[14][parseInt(q[14], 10)]],
            [q_E[15], ans_E[15][parseInt(q[15], 10)]],
            [q_E[16], ans_E[16][parseInt(q[16], 10)]],
            [q_E[17], ans_E[17][parseInt(q[17], 10)]],
            [q_E[18], ans_E[18][parseInt(q[18], 10)]],
            [q_E[19], ans_E[19][parseInt(q[19], 10)]],
            [q_E[20], ans_E[20][parseInt(q[20], 10)]],
          ],
        };


        if (language==="English") {
          table0=table_E;
        } else {
          table0=table_P;
        }


        pdf.table(table0, {
          prepareHeader: () =>pdf.font("Helvetica-Bold"),
          prepareRow: (row, i) => pdf.font("Helvetica").fontSize(12),
        });
        // https://www.andronio.me/2017/09/02/pdfkit-tables/
        //* **************************** */


        pdf.moveDown(); pdf.moveDown();

        // pdf.text(recommendationsE_BASIC,  {align: 'justify'});


        pdf.addPage();
        pdf.fontSize(14);
        pdf.font("Times-Bold");

        if (language==="English") {
          pdf.text("OVERALL GUIDANCE FOR " + companyName.toUpperCase(), {align: "center"});
        } else {
          pdf.text("ORIENTAÇÃO GERAL PARA " + companyName.toUpperCase(), {align: "center"});
        }
        pdf.moveDown();

        //* ************************************************************
        // pdf.addPage();
        const responseArray= getResponseArray(language);
        const commentsToAdd=[[], [], [2, 3, 16], [2, 3, 10], [1, 2, 3], [4, 5, 11, 12, 16], [7], [21], [5, 14], [8], [9, 10, 11, 12, 13, 14], [9, 11, 15], [2, 3, 15], [2, 7, 11], [5, 12, 14], [6], [18], [17, 18, 19, 20], [], [], []];
        // for each of the 21 questions the comment to include in the report
        let indicesToPrint=[];
        let k; // the question numbers are 1 higher, these are the array indices
        for (k=2; k<18; k++) {
          // ("question answer " + parseInt(q[k],10)+ " commentsToAdd[k] " + commentsToAdd[k])
          if (parseInt(q[k], 10)<3) {
            let kk;
            for (kk=0; kk<commentsToAdd[k].length; kk++) {
              indicesToPrint.push(parseInt(commentsToAdd[k][kk], 10));
            }
          }
        }

        // console.log("Score " + score + " indicesToPrint " + indicesToPrint)
        indicesToPrint=removeDuplicates(indicesToPrint);
        // Step 1
        // const uniqueSet = new Set(indicesToPrint);
        // Step 2
        // const indicesToPrint = [...uniqueSet];

        // console.log("Score " + score + " indicesToPrint " + indicesToPrint)
        if (score<20) {
          indicesToPrint= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 1, 5, 6, 17, 18, 19, 20, 21];
        }
        if (score>=20 && score<40) {
          indicesToPrint=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        }
        if (score>=40 && score<60) {
          console.log(" over 40");
        }
        if (score>=60 && score<85) {
          console.log(" over 60");
        }
        if (score>=85 ) {
          indicesToPrint=[17, 18, 19, 20];
        }

        writeToReport(responseArray, indicesToPrint, pdf);
        // Measure the text
        const width = pdf.widthOfString("Assentian Limited");
        const height = pdf.currentLineHeight();
        // Add the underline and link annotations

        // pdf.underline(72,400, width, height, {color: 'blue'})
        //   .link(72,400, width, height,'www.assentian.com' );
        pdf.moveDown();
        pdf.fontSize(12)
            .fillColor("blue")
        // .text('Assentian Limited', 72, 300, {
            .text("Assentian Limited", {
              link: "http://www.assentian.com",
              underline: true,
            },
            );


        //* ******************************************************************************************************************

        // see the range of buffered pages
        const range = pdf.bufferedPageRange();
        let i;
        for ( i=range.start; i<(range.start + range.count); i++) {
          pdf.switchToPage(i);
          pdf.text("Page " +(i + 1)+" of " + range.count, 264,
              pdf.page.height - 40,
              {height: 25, width: 100});
        }
        // pdf.flushPages();
        // manually flush pages that have been buffered
        // pdf.flushPages()

        // or, if you are at the end of the document anyway,
        // pdf.end() will call it for you automatically.
        // Close PDF and write file.

        // let path = require('path');
        // let fileName=companyName.toUpperCase() +".pdf";
        // let tempFilePath = path.join(os.tmpdir(), fileName);

        // Stream contents to a file
        pdf.pipe(
            fs.createWriteStream(tempFilePath),
        )
            .on("finish", () =>{
              // console.log('Have written all data to file ' + fileName);
              // If autoClose is set to true (default behavior) on 'error' or 'finish' the file descriptor will be closed automatically

              return mailTransport.sendMail(mailOptions, (error, info)=>{
                if (error) {
                  return console.log("send mail error  ", error);
                } else {
                  fs.unlink(tempFilePath, (err) => {
                    if (err) {
                      console.log("Failed to delete temp file:"+err);
                    } else {
                      console.log("Successfully deleted temp file");
                    }
                    // return null;
                  });


                  return null;
                }
              }); // mailTransport
            }); // on
        // Close PDF and write file.
        pdf.end();


        //* ***************end of pdf  ************************************** */
        return null;
      })
          .then(() => {
            console.log("calling sendJson");
            sendJson(fs, os, usersRef, gmailEmail, gmailPassword, ccID,
                companyName, receiverID, userId, username, table0);
            return null;
          },

          )
          .catch((err) =>{
            console.log("error", err);
          });
      return null;
    });


function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b);
}


//* ************************************************** */
//  functions to support the pdf for GDPR pdf
//
//


function return_dbBlocks(l) {
  if (l==="English") {
    return [
      {start: "1", end: "7", blockHeader: "Maintain Data Governance",
        blockBody: "Some Areas to Improve - When processing personal data, Data Protection and Privacy (DPP) practitioners and enterprises should provide comprehensive governance to ensure conformance with established privacy and data protection regulations in a positive sense. The governing processes should enable all associates and other internal and external stakeholders to rely on a defined set of principles, policies and procedures that clearly define and explain how personal data may be processed and how senior management and other leadership functions support related activities."},

      {start: "8", end: "13", blockHeader: "Acquire, Identify and Classify Personal Data",
        blockBody: "The acquisition of new personal data, identification of existing personal data and classification of information assets form the basis for managing and controlling such data in accordance with expected norms. Data Protection and Privacy (DPP) practitioners and enterprises must therefore provide a robust process that ensures conformant processing as well as efficient data management. This process should also establish a defined and measurable life cycle for personal data, taking into account the principle of data minimisation."},

      {start: "14", end: "17", blockHeader: "Manage Personal Data Risk",
        blockBody: "Personal data processing is subject to a number of predefined risks that must be identified, evaluated and treated in an adequate and appropriate manner. The potential impact of these risks must be assessed and analyzed in view of existing risk mitigation measures. The risk management process must further manage residual risk, using recognized tools and standards."},

      {start: "18", end: "23", blockHeader: "Manage Personal Data Security",
        blockBody: "Personal data processing requires adequate and comprehensive security around the information assets in scope. As personal data—and Personally Identifiable Information (PII) in the wider sense—represent a significant business and financial value, they should be treated accordingly and assigned an adequate level of protection in terms of confidentiality, integrity and availability. The security process for personal data should ensure a reasonable level of protection in view of the corresponding risks and impacts, making use of existing risk evaluations and impact analyses. It should further leverage existing information security processes to strengthen the protection of personal data."},

      {start: "24", end: "28", blockHeader: "Manage the Personal Data Supply Chain",
        blockBody: "Where personal data is processed by more than one organisation, the supply chain across all controllers and processors must be managed and controlled. The management process, therefore, includes all controllers (jointly or separately) as well as any sub-processors handling personal data. The supply chain process is supported by processing agreements and supply chain controls, based on the risks and potential impacts along the chain. It further replicates the governance framework and its constituent parts from the primary level of the controller(s) to any other actors in the supply chain."},

      {start: "29", end: "32", blockHeader: "Manage Incidents and Breaches",
        blockBody: "Data Protection and Privacy (DPP) related incidents and breaches should be reported. This includes notification of supervisory authorities as well as communications with data subjects actually or potentially affected by the breach. From an organisational perspective, the incident (or eventual crisis) should be managed in terms of  conformance to established privacy and data protection regulations as well as business continuity and recovery of services and information. This requires a robust incident and breach management process."},

      {start: "33", end: "35", blockHeader: "Create and Maintain Awareness",
        blockBody: "Data Protection and Privacy (DPP), as fundamental values within an enterprise, require awareness and ongoing information and education about Data Protection and Privacy (DPP). The awareness process supports all other processes by explaining, communicating and reinforcing good practice and customer expectations. The awareness process further includes education, training and qualification elements to ensure that enterprises have the requisite skill sets and develop their expertise in line with legislative and regulatory developments."},

      {start: "36", end: "40", blockHeader: "Organize DPO Function",
        blockBody: "Established privacy and data protection regulations mandate a Data Protection Officer (DPO) as an individual or function. A process is needed to ensure that once established, the DPO performs regular tasks and interacts with other parts of the enterprise. In doing so, the DPO must further ensure conformance with laws and regulations. This entails the involvement of the DPO in any matters that might be related to personal data processing, effectively creating a broad function that should be structured and well organised."},

      {start: "41", end: "46", blockHeader: "Maintain Internal Controls",
        blockBody: "Personal data processing in accordance with established privacy and data protection regulations requires a comprehensive set of internal controls that ensure compliance and provide reasonable assurance. The process of maintaining internal controls over personal data processing should be fully aligned with the general system of internal controls operated by the enterprise. As a subset of controls, the Personal Data (PD) processing controls should be supported by, and integrated with, enterprise-level and general controls to avoid duplication or ambiguity. The process of maintaining internal controls should further follow the personal data life cycle, as indicated below."},


    ];
  } else {
    return [
      {start: "1", end: "7", blockHeader: "Manter a governança de dados",
        blockBody: "Algumas áreas a serem aprimoradas - Ao processar dados pessoais, os profissionais e as empresas de proteção de dados e privacidade (DPP) devem fornecer uma governança abrangente para garantir a conformidade com os requisitos legais em um sentido positivo. Os processos de governo devem permitir que todos os associados e outras partes interessadas internas e externas confiem em um conjunto definido de princípios, políticas e procedimentos que definam e explicam claramente como os dados pessoais podem ser processados ​​e como a gerência sênior e outras funções de liderança apoiam atividades relacionadas. "},

      {start: "8", end: "13", blockHeader: "Adquirir, identificar e classificar dados pessoais",
        blockBody: "A aquisição de novos dados pessoais, a identificação de dados pessoais existentes e a classificação dos ativos de informação formam a base para o gerenciamento e o controle de tais dados, de acordo com os regulamentos. Os profissionais e empresas de proteção de dados e privacidade devem, portanto, fornecer um processo robusto que garanta o processamento em conformidade com o GDPR, bem como o gerenciamento eficiente dos dados. Esse processo também deve estabelecer um ciclo de vida definido e mensurável para dados pessoais, levando em consideração o princípio de minimização de dados. "},

      {start: "14", end: "17", blockHeader: "Gerenciar risco de dados pessoais",
        blockBody: "O processamento de dados pessoais está sujeito a uma série de riscos predefinidos que devem ser identificados, avaliados e tratados de maneira adequada e apropriada. O impacto potencial desses riscos deve ser avaliado e analisado em vista das medidas existentes de mitigação de riscos. O processo de gerenciamento de riscos deve gerenciar ainda mais os riscos residuais, usando ferramentas e padrões reconhecidos. "},

      {start: "18", end: "23", blockHeader: "Gerenciar segurança de dados pessoais",
        blockBody: "O processamento de dados pessoais requer segurança adequada e abrangente em torno dos ativos de informação no escopo. Como os dados pessoais - e as PII no sentido mais amplo - representam um valor comercial e financeiro significativo, eles devem ser tratados adequadamente e receber um nível adequado de proteção em termos de confidencialidade, integridade e disponibilidade. O processo de segurança para dados pessoais deve garantir um nível razoável de proteção em vista dos riscos e impactos correspondentes, utilizando as avaliações e análises de impacto existentes. Deve alavancar ainda mais os processos de segurança da informação existentes para fortalecer a proteção de dados pessoais. "},

      {start: "24", end: "28", blockHeader: "Gerenciar a cadeia de suprimento de dados pessoais",
        blockBody: "Quando os dados pessoais são processados ​​por mais de uma organização, a cadeia de suprimentos em todos os controladores e processadores deve ser gerenciada e controlada de acordo com os regulamentos. O processo de gerenciamento inclui, portanto, todos os controladores (em conjunto ou separadamente), bem como quaisquer subprocessadores que manipulam dados pessoais. O processo da cadeia de suprimentos é suportado por acordos de processamento e controles da cadeia de suprimentos, com base nos riscos e impactos potenciais ao longo da cadeia. Além disso, replica a estrutura de governança e suas partes constituintes do nível principal do (s) controlador (es) para quaisquer outros atores da cadeia de suprimentos. "},

      {start: "29", end: "32", blockHeader: "Gerenciar incidentes e violações",
        blockBody: "Incidentes e violações relacionados à proteção de dados e à privacidade devem ser relatados de acordo com os regulamentos. Isso inclui a notificação das autoridades de supervisão, bem como as comunicações com os titulares dos dados efetivamente ou potencialmente afetados pela violação. Do ponto de vista organizacional, o incidente (ou eventual crise) deve ser gerenciado em termos de conformidade regulatória, bem como continuidade dos negócios e recuperação de serviços e informações. Isso requer um processo robusto de gerenciamento de incidentes e violações. "},

      {start: "33", end: "35", blockHeader: "Criar e manter consciência",
        blockBody: "A proteção e privacidade de dados (DPP) como valores fundamentais dentro de uma empresa exigem conscientização e informações e educação contínuas sobre o DPP. O processo de conscientização suporta todos os outros processos, explicando, comunicando e reforçando os requisitos regulamentares e as boas práticas. O processo de conscientização inclui ainda elementos de educação, treinamento e qualificação para garantir que as empresas possuam as habilidades necessárias e desenvolvam seus conhecimentos de acordo com os desenvolvimentos legislativos e regulamentares. "},

      {start: "36", end: "40", blockHeader: "Organize DPO Function",
        blockBody: "Os regulamentos de privacidade e proteção de dados determinam que um oficial de proteção de dados (DPO) seja um indivíduo ou uma função. É necessário um processo para garantir que, uma vez estabelecido, o DPO realize tarefas regulares e interaja com outras partes da empresa. Ao fazer isso, o DPO deve garantir ainda mais a conformidade com as leis e regulamentos, e especificamente com os regulamentos. Isso implica o envolvimento do DPO em quaisquer assuntos que possam estar relacionados ao processamento de dados pessoais, criando efetivamente uma função ampla que deve ser estruturada e bem organizada. "},

      {start: "41", end: "46", blockHeader: "Manter controles internos",
        blockBody: "O processamento de dados pessoais de acordo com o GDPR requer um conjunto abrangente de controles internos que garantam a conformidade e fornecem uma garantia razoável. O processo de manutenção de controles internos sobre o processamento de dados pessoais deve estar totalmente alinhado com o sistema geral de controles internos operados pela empresa. Como um subconjunto de controles, os controles de processamento do PD devem ser suportados e integrados a controles gerais e de nível empresarial para evitar duplicação ou ambiguidade. O processo de manutenção dos controles internos deve seguir ainda mais o ciclo de vida dos dados pessoais, conforme indicado abaixo. "},


    ];
  }
}


function return_dbHeader(l) {
  if (l==="English") {
    return ["Has your organisation established a Data Protection and Privacy (DPP) Governance Framework",
      "Does your organisation maintain a Data Processing Register",
      "Does your organisation maintain Binding Corporate Rules (BCRs)",
      "Does your organisation maintain Rules for Consent",
      "Does your organisation maintain Rules for Data Subject Requests",
      "Does your organisation maintain Rules for Managing Complaints",
      "Does your organisation ensure Impartial Oversight",
      "Does your organisation manage the Data Life Cycle",
      "Does your organisation conduct Personal Data Identification",
      "Does your organisation maintain Data Classification",
      "Does your organisation maintain a Personal Data Register",
      "Does your organisation manage Special Categories Data",
      "Does your organisation meet the demands for erasure (Right to be Forgotten)",
      "Has your organisation conducted a Risk Evaluation",
      "Has your organisation conducted a Data Protection Impact Assessment (DPIA)",
      "Does your organisation manage Risk Treatment",
      "Does your organisation conduct Risk Validation",
      "Does your organisation manage Data Anonymization and Pseudonymization",
      "Does your organisation have an Encryption Strategy",
      "Does your organisation manage Protection Levels",
      "Does your organisation manage Resilience",
      "Does your organisation manage access to personal data",
      "Does your organisation manage Testing and Assessment of Personal Data Security",
      "Does your organisation manage Controllers and Processors",
      "Do you manage Sub-processing",
      "Does your organisation maintain Processing Agreements",
      "Does your organisation manage Supply Chain Impact",
      "Does your organisation maintain Supply Chain Controls",
      "Does your organisation manage notifications of supervisory authorities",
      "Does your organisation manage Data Subject Communications",
      "Does your organisation perform Incident and Crisis Management",
      "Does your organisation manage Evidence and Claims",
      "Does your organisation maintain Enterprise-wide Awareness",
      "Does your organisation manage Skills and Education",
      "Does your organisation provide Training",
      "Does your organisation have Data Protection Officer (DPO) Function",
      "Does your organisation manage Budget and Resources of the DPO function",
      "Does your organisation manage Organisational Interfaces",
      "Do you manage Reporting",
      "Does your organisation manage External Services",
      "Does your organisation maintain Data Acquisition Controls",
      "Does your organisation maintain Processing Controls",
      "Does your organisation maintain Storage Controls",
      "Does your organisation maintain Deletion Controls",
      "Does your organisation maintain Monitoring Controls",
      "Is your Organisation prepared to manage independent reviews",
    ];
  } else {
    return ["Estabelecer a estrutura de governança de proteção de dados e privacidade (DPP)",
      "Manter registro de processamento",
      "Manter regras corporativas vinculativas (BCRs)",
      "Manter regras de consentimento",
      "Manter regras para solicitações de titulares de dados",
      "Manter regras para gerenciar reclamações",
      "Garantir a supervisão imparcial",
      "Gerenciar o ciclo de vida dos dados",
      "Conduzir a identificação de dados pessoais",
      "Manter classificação de dados",
      "Manter registro de dados pessoais",
      "Gerenciar dados de categorias especiais",
      "Gerenciar apagamento (direito a ser esquecido)",
      "Realizar avaliação de risco",
      "Realizar avaliação de impacto na proteção de dados (DPIA)",
      "Gerenciar tratamento de risco",
      "Realizar validação de risco",
      "Gerenciar anonimização e pseudonimização",
      "Gerenciar criptografia",
      "Gerenciar níveis de proteção",
      "Gerenciar resiliência",
      "Gerenciar acesso",
      "Gerenciar testes e avaliação",
      "Gerenciar controladores e processadores",
      "Gerenciar subprocessamento",
      "Manter contratos de processamento",
      "Gerenciar o impacto da cadeia de suprimentos",
      "Manter controles da cadeia de suprimentos",
      "Gerenciar notificação",
      "Gerenciar comunicações com o titular dos dados",
      "Executar gerenciamento de incidentes e crises",
      "Gerenciar evidências e reivindicações",
      "Manter a consciência corporativa",
      "Gerenciar habilidades e educação",
      "Gerenciar treinamento",
      "Manter a função de oficial de proteção de dados (DPO)",
      "Gerenciar orçamento e recursos",
      "Gerenciar interfaces organizacionais",
      "Gerenciar relatórios",
      "Gerenciar serviços externos",
      "Manter controles de aquisição de dados",
      "Manter controles de processamento",
      "Manter controles de armazenamento",
      "Manter controles de exclusão",
      "Manter controles de monitoramento",
      "Conduzir Revisão Independente",

    ];
  }
}

function returnFA(l) {
  if (l==="English") {
    return returnFA_E();
  } else {
    return returnFA_P();
  }
}

function returnLA(l) {
  if (l==="English") {
    return returnLA_E();
  } else {
    return returnLA_P();
  }
}


function returnPA(l) {
  if (l==="English") {
    return returnPA_E();
  } else {
    return returnPA_P();
  }
}


function returnNA(l) {
  if (l==="English") {
    return returnNA_E();
  } else {
    return returnNA_P();
  }
}


//* *************************************************** */
function returnFA_E() {
  return ["Your enterprise is well-prepared in this area. Where appropriate, the governance framework should reference existing policies and procedures that are linked to personal data processing (for example, the information security policy or the identity and access management policy). Likewise, organisational and technical concepts, a governance framework and arrangements should be referenced to ensure consistency (for instance, any existing data classification schemes or the determination of information asset protection levels).",

    "Governance elements around a processing register include, but are not limited to: \n•  Information assets used (from personal data register)\n•  Purpose(s) of processing Business processes or other organisational processes utilizing the assets \n•  Processing life cycle from initial data acquisition to data deletion (planned or ad hoc)\n•  The governing process around the processing register should further define a role or function responsible for maintaining the register, as well as accessibility of the register to internal and external reviews. Further governance provisions might include the scope and procedure for presenting the register as evidence, both internally and externally. In situations where complex processing of large amounts of personal data takes place, the register should be governed by a policy or appropriate key operating procedure.",

    "Your enterprise is doing well in this area. An enterprise should establish, maintain, continuously monitor and adapt binding corporate rules that adequately and comprehensively reflect the internal and external governance framework. Activities in conjunction with BCRs include, but are not limited to:\n• Definition, description and approval of BCRs by senior management\n• Communication of BCRs on an enterprise-wide basis\n• Annual or ad hoc validation and updating of BCRs\n• Integration of BCRs in third-party contractual relationships\n• Monitoring of BCR conformance internally and externally",

    "Your enterprise's rules for consent are well-defined and communicated. At a minimum, governance provisions around consent should cover:\n• Transparency and enabling information to data subjects\n• Types of consent and related requirements\n• Withdrawal of consent by data subjects\n• Specific processes, controls and verification for child consent, including appropriate verification of age and/or parental authority as well as parental Communication channels, simplicity of language and accessibility of consent-based interfaces",

    "Your enterprise is well-equipped to process data subject requests. At a minimum, governance provisions around data subjects requests should cover:\n• Receiving and documenting data subject requests\n• Purpose-related, legal and technical validation of requests\n• Formal response, including communications channels and formats\n• Interfaces to internal and supply chain processes\n• Interface to personal data register and processing register\n• Independent review of requests by the DPO function",

    "Your enterprise is effective at addressing data subjects' complaints. At a minimum, governance provisions around data subjects’ complaints should cover:\n•  Receipt and initial documentation, including any formal response to supervisory authorities\n•  Complaint analysis, including organisational, legal and technical interfaces within the enterprise\n•  Definition and implementation of remediation where applicable\n•  Identification of potential gaps or weaknesses leading to the complaint and opportunities for improvement",

    "Your enterprise has a well-governed process to ensure impartial oversight. Activities in conjunction with impartial oversight include, but are not limited to:\n• Organisational roles performing and ensuring impartial oversight\n• Roles and responsibilities (RACI), including demonstrated impartiality\n• Objectives, scope and extent of oversight activities\n• Risk-based frequency of oversight activities\n• Procedures and guidance for planning, deploying and reporting",

    "Your enterprise is well-prepared in this area. At a minimum, the following parts of the cycle should be defined and implemented:\n•  Data creation or acquisition, including the personal data processing (supply)chain\n•  Information asset classification, including protection levels and assignment to special categories\n•  Inclusion in the personal data register and the processing register and removal from registers\n•  Actual processing and related controls\n•  Temporary and permanent storage, including virtualised and cloud storage\n•  Archiving and aggregation\n•  Deletion, both planned (end of life or end of purpose) and ad hoc (erasure request, etc.)",

    "Your enterprise is doing excellent work identifying and documenting personal data. The identification process  should, at a minimum, address the following aspects:\n•  Definition of criteria in accordance with established privacy and data protection regulations\n•  Procedure for analysing existing data sets, possibly in combination with the analysis of security protection levels Confidentiality, Integrity and Availability (CIA)\n•  Handover procedure to personal data register\n•  Analysis of potential inference (indirect identification of natural persons) from separate and/or dispersed data sets\n•  Onboarding procedure for new data\n•  Procedures and controls for third parties.",

    "Your enterprise is effective at maintaining data classification. At a minimum, personal data classification should address:\n•  General attribute of “personal” in accordance with established privacy and data protection regulations; wider personal relevance as Personally Identifiable Information (PII) if needed\n•  Specific classification relating to special categories and purposes, including limitations and additional security requirements\n•  Classification in terms of nonrepudiation of transactions involving personal data\n•  Other aspects, such as applicable professional secrecy or restricted access criteria",

    "Your enterprise's personal data register is very well-maintained. At a minimum, the personal data register process should address:\n•  Type of data and aggregation (if any) into information assets\n•  Relevant links between data sets that form information assets under established privacy and data protection regulations\n•  Data types and formats, including data not held in electronic formats (e.g., paper, microfiche)\n•  Data location and instantiation, including multiple copies, virtualised and cloud images, etc.\n•  Life cycle and life span information, including planned archiving and deletion\n•  Linked processing steps, organisational units and processing purposes, clearly detailing the when, why, where and by whom of personal data processing",

    "Your enterprise is well-equipped to manage special categories data. This requires a robust process that identifies, controls and documents any processing of data belonging to one or more special categories, covering at a minimum, but not limited to:\n•  Mapping of identified information assets to special categories in accordance with established privacy and data protection regulations\n•  Documentation of justifying circumstances (as per established privacy and data protection regulations) for each information asset\n•  Documentation of any new or changed classification of such information assets.  NOTE: • Documentation of all communications with data subjects or supervisory authorities as relating to the information asset\n•  Documentation of asset-related consent and withdrawal of consent\n•  Verified links to personal data register and processing register, including evidence of processing that is restricted to the defined purpose(s).",

    "Your enterprise is well-prepared to respond to demands for erasure. The process should, at a minimum, address the following aspects:\n•  Receipt, confirmation and analysis of erasure requests by data subjects or competent authorities\n•  Validation and internalization of erasure requests transferred by third parties\n•  Defined interfaces to other processes, i.e., personal data register and\nprocessing register, data classification and data life cycle\n•  Approvals and independent-verification procedures around erasure\n•  Erasure confirmation and communications procedure (to data subjects or authorities).",

    "Your enterprise has conducted a thorough risk evaluation. As a reminder, the results of the risk evaluation should include, at a minimum:\n•  Comprehensive register of events and threats leading to established privacy and data protection risk categories\n•  Frequency estimates and precautionary assumptions\n•  Aggregation and clustering of events leading to the same risks materialising\n•  Risk classification, usually in accordance with the overarching organisational risk classification scheme.",

    "Your enterprise has successfully conducted a data protection impact assessment. As a reminder, the Data Protection Impact Assessment (DPIA) must take into account existing controls and risk mitigation measures and aim at identifying the potential impact resulting from the residual risk that has not been or cannot be fully mitigated.",

    "Your enterprise is doing an excellent job managing risk treatment. As a reminder, the risk treatment process should, at a minimum, cover the following:\n•  Risk avoidance or elimination, including changes to processing arrangements or discontinuation of processing (restructure or exit)\n•  Risk elimination through additional controls or safeguards\n•  Risk transfer, including restructuring of the personal data supply chain\n•  Risk reduction through additional controls or mitigation measures\n•  Risk tolerance, based on the estimated frequency and impact.",

    "Your enterprise has a robust validation process. As a reminder, at a minimum, the risk validation process should address:\n•  Confirmation (or change) of risk evaluation results, including frequency estimates and the event/threat universe reasonable period of observation\n•  Review of any incidents or breaches that may have occurred since the last validation\n•  Analysis of any changes to the framework and terms of reference, i.e., in respect of any legislative or regulatory, political or financial events.",

    "Your enterprise is doing excellent work in this area. Anonymisation and pseudonymisation should cover, but are not limited to:\n• Identification of personal data sets to be anonymized/pseudonymized\n•  Definition of techniques at all technical levels, e.g., file, database record, non electronic filing systems\n•  Documentation and log of actual anonymisation/pseudonymisation\n•  Defined link to personal data register and processing register\n•  Recursive application of the need-to-know principle across the supply chain; integration of the actual need to know with identity and access management.",

    "The encryption strategy and its components should be based on risk and efficiency, making sure that established privacy and data protection  risks are fully understood and internalised in any decision. Your enterprise is doing very well in this area. As a reminder, at a minimum, the encryption process should address:\n•  Definitive set of personal data and information assets to be encrypted, based on the assigned protection levels in established privacy and data protection risk and impact categories\n•  Definition of encryption techniques and targets, e.g., individual data, database elements, whole databases, transactions, etc.\n•  Links to recognized or approved encryption techniques and tools already in use within the enterprise\n•  Scope, plan and implementation steps for additional encryption needed for personal data.",

    "Your enterprise is doing an excellent job managing protection levels. The process around protection levels for personal data provides a defined interface (both ways) between general information security and personal data security. Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in protection level analyses.",

    "Your enterprise has a well-governed process to manage resilience. As a reminder, at a minimum, the resilience process should cover:\n•  Personal data criticality, often expressed as a combination of integrity and availability requirements\n•  Processing criticality as a function of time, i.e., maximum tolerable period of unavailability, maximum tolerable data loss\n•  Recovery plans for personal data sets\n•  Defined links to general business continuity and IT service continuity plans\n•  Backup and restore concepts for personal data sets, linked to overall backup and restore plans and procedures\n•  Multiple instantiations of personal data sets requiring high availability, i.e., fully resilient processing.",

    "Your enterprise is effectively managing access to personal data. Access restrictions and limitations resulting from personal data processing requirements should be documented and fed into the general Identity and Access Management (IAM) process. The access management process for personal data, therefore, provides an interface (both ways) to general Identity and Access Management (IAM). Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in access management.",

    "Your enterprise has a robust process in place to manage testing and assessment of personal data security. As a reminder, at a minimum, the process should address:\n•  Types of test and assessment, e.g., conceptual testing, vulnerability scanning and penetration testing\n•  Frequency of testing\n•  Evidence of continual improvement, i.e., progressively more demanding tests and assessments over time\n•  Test logging and securing evidence\n•  Analysis of weaknesses and documentation of improvement opportunities.",

    "Your enterprise has a robust process in place for managing controllers and processors. As a reminder, the process should cover at least:\n•  Identification of primary and joint controllers, including individual or collective purpose(s) for processing personal data\n•  Identification of processors, including the defined scope and extent of processing on behalf of one or more controllers\n•  Links to the personal data register, reflecting the data sets and the way they are handled across the supply chain (data in flow; data at rest)\n•  Links to the processing register, reflecting the processes or process steps\nperformed by each actor in the supply chain\n•  Documentation of vendor (processor) management and control arrangements, often embedded into general vendor management of an enterprise",

    "In complex supply chains, the sub-processing management process is an essential element of ensuring  privacy and data protection regulations conformance across the whole supply chain to expected or established norms. Your enterprise is doing very well in this area. As a reminder, the sub-process management process should cover, at a minimum:\n•  Formal request procedure to primary processors; disclosure of any further outsourcing\n•  Documentation and register of subprocessing, including scope, extent and purpose(s)\n•  Evidence of conformance to established privacy and data protection regulations or norms, including processes, controls, concepts and review results\n•  Audit reports and other independent assurance, if available\n•  Processing agreements between primary processors and sub-processors",

    "Your enterprise is doing well in this area. As a reminder, at a minimum, the process around these agreements should cover:\n•  Definition, approval and roll-out of standardised agreements, including templates\n•  Monitoring of fulfilment on a regular basis\n•  Planning and execution of reviews, primarily under the standard right to audit\n•  Receipt, analysis and validation of third-party evidence for conformant processing, e.g., certification and attestation reports\n•  Regular review and updating of processing agreements, terms and conditions, in line with legislative and regulatory activity\n•  Termination and exit planning for individual contractual relationships",

    "Your enterprise is well-prepared in this area. In a supply chain with multiple actors, impacts resulting from  privacy and data protection risks may materialise at any point and at any time. Therefore, Data Protection and Privacy (DPP) practitioners and enterprises should apply their own Data Protection Impact Assessment (DPIA) approach to all parts of the supply chain and document the feedback received from each of the parties. This includes standardised reporting as well as ad hoc reviews or plausibility checks. The overall impact should then be aggregated based on the processing register and the flow of data across various supply chain participants. Care should be taken in understanding how impacts in one place may aggravate impacts in other parts of the supply chain.",

    "Where personal data processing is performed in a supply chain, internal controls at a processor or subprocessor must be as effective as the ones within the controller organisation. Your enterprise's well-defined supply chain controls process ensures that this is the case. As a reminder, at a minimum, the supply chain controls process should cover the following:\n•  Obtaining and analysing internal controls documentation from third parties\n•  Mapping supply chain controls to the internal control system (ICS) at the controller organisation\n•  Procedures for test of design (ToD), i.e., standard techniques for evaluating controls\n•  Procedures for test of effectiveness (ToE), i.e., sampling and collecting evidence that demonstrates the effectiveness of controls at third parties\n•  Monitoring and log review arrangements, including accessibility of log data in as much as these, relate to personal data processing\n•  Point-in-time or continuous audit rights, including audit planning and deployment",

    "Your enterprise is well-prepared to manage notification in a timely manner. As a reminder, at a minimum, the process of notifying supervisory authorities should include:\n•  Information gathering / investigative procedure, outlining the interaction between the Data Protection Officer (DPO) function and other parts of the enterprise and/or external services\n•  Standardised reporting package including the minimum requirements of privacy and data protection information sets and appropriate templates",

    "Your enterprise is well-equipped to notify data subjects in event of an incident or breach. As a reminder, at a minimum, the process of notifying data subjects should cover:\n•  Standardised reporting format and templates, adapted to and optimised for various channels of communication (individual, group, public)\n•  Predefined and approved key messages expressing the enterprise’s actions (investigation, consequences, remediation, improvement, etc.)\n•  Organisational responsibilities with regard to formulating and conveying key messages, e.g., involvement of the communications department, legal advice, etc.\n•  Ad hoc communications facilities offered to data subjects, e.g., help line, free phone number, dark site, etc.",

    "Your enterprise has a well-defined incident and crisis management process. From the perspective of Data Protection and Privacy (DPP) practitioners and organisational units initially discovering the breach, the process should cover at least:\n•  Description and documentation of known facts and figures, in a standardised format where appropriate\n•  Defined link to general escalation and alerting process, often defined by the business crisis management (BCM) function\n•  Predefined generic personal data scenario for business continuity and crisis management, similar to other special scenarios such as cyberattack, pandemic, etc.\n•  Predefined relationships and communications channels with external actors, i.e., external services such as investigative or forensics specialists\n•  Ongoing communications protocol between organisational line units and incident/crisis management teams.",

    "Your enterprise is well-prepared to manage evidence and claims appropriately. Personal data breaches represent instances of noncompliance but also indicate that internal and/or external negligence or criminal activity may have been present. The evidence and claims process should therefore cover, at a minimum:\n•  Defined procedures for collecting and securing evidence, including chain of custody\n•  Availability of specialised services such as IT forensics\n•  Procedure and templates for post-incident analysis and reporting\n•  Procedure for substantiating claims against third parties, including the legal or contractual basis for such claims\n•  Procedure for preparing defenses against claims by third parties, including aspects of appeal (regulatory decisions)\n•  Defined link to post-incident Data Protection Officer (DPO) reporting",

    "Your enterprise is doing a good job maintaining enterprise awareness. At a minimum, the enterprise-wide awareness process should cover:\n•  Definition and description of privacy and data protection requirements in day-to-day organisational processes, including examples of personal data processing\n•  Campaign materials emphasising specific aspects of Data Protection and Privacy (DPP), personal data processing and privacy and data protection related points to note\n•  Program/project plans setting target dates for awareness measures\n•  Third-party awareness materials and details on how to include third parties in awareness campaigns",

    "Data Protection and Privacy management, including the context of established privacy and data protection regulations, require a set of skills and qualifications that must be present in the enterprise or contracted through external services. The management of skills and education is an essential process to ensure that privacy and data protection  processes, risks and consequences are fully understood. Your enterprise is doing very well in this area. As a reminder, the skills and education process should include, but not be limited to:\nNOTE: • Definition of skills, levels and internal requirements for Data Protection and Privacy (DPP) related tasks and positions\n NOTE: • Mapping of skills to roles and organisational functions (matrix)\n• Identification of suitable qualification levels and formal qualifications or certifications, as needed for each part of the matrix\n• Education paths for different roles and organisational functions in Data Protection and Privacy (DPP)\n• Gathering appropriate educational sources, materials and opportunities for guided or self-study.",

    "Your enterprise has a robust and effective training process. Training is an important component of overall awareness, providing ongoing learning opportunities and reinforcing the key messages around Data Protection and Privacy (DPP) and privacy and data protection regulations. At a minimum, the training process should cover:\n•  Defined and validated basic privacy and data protection regulations training, preferably mandatory for all members of the enterprise\n•  Training concept based on the skills and education matrix\n•  Training plan, typically on an annual basis, including internal and external training opportunities\n•  Preparation of training materials, guided study and self-study\n•  Preparatory training aids for higher qualifications in Data Protection and Privacy (DPP) and established privacy and data protection regulations, including certification exam preparation, etc.\n•  Defined external training sources and providers for specific purposes, e.g., legal or Data Protection Officer (DPO) training.",

    "Your enterprise has a well-established DPO function. As a reminder, at a minimum, the process of maintaining and running the DPO should cover the following:\n•  Organisational structure and positioning of the DPO function, including the DPO office and its points of contact in other parts of the enterprise\n•  Design of administrative tasks and processes for the DPO function\n•  Design of regular work program in an annual cycle\n•  Human resource planning, skills and education needs.",

    "Your enterprise is doing well managing the budget and resources of the DPO function. As a reminder, the budgeting and resourcing process should at least cover:\n•  Annual financial budget cycle, linking into general budgeting\n•  Human resource and headcount planning\n•  Technical resource planning, including tools, licensing, etc.\n•  External service planning and budgeting, e.g., for consultants or legal advisors\n•  Links to general financial reporting within the enterprise.",

    "You have exceptional representation of the DPO function in the overall enterprise. As a reminder, the management process for organisational interfaces should cover at least:\n•  Documentation of regular, formal contacts throughout the enterprise\n•  DPO participation in standing committees and other formal institutional meetings\n•  Regular communications between the DPO function and other organisational units, including minutes and other reports\n NOTE:  • Documented process steps requiring DPO involvement, including consultation and information (RACI).",

    "Formal internal and external reporting is an important part of the DPO function. Your enterprise is doing very well in this area. As a reminder, at a minimum, the reporting management process should cover:\n•  Reporting schedules for internal and external reporting to and by the DPO function\n•  Procedures specifying report templates, formal content, frequency and distribution as well as Confidentiality, Integrity and Availability (CIA) ratings for reports\n•  Tracking procedure for reporting, covering all reporting schedules.",

    "Your enterprise is well-positioned to manage privacy and data protection regulations conformance and related requirements that are contracted through external services. As a reminder, the process for managing external services should address, at a minimum:\n•  Purpose and substance of external services, including a processing agreement\n•  Defined and agreed protection level for the services rendered, specifying confidentiality, integrity and availability\n•  Supplier risk analysis, including in-depth checks and due diligence where appropriate\n•  Information security analysis\n•  Right to audit, analysis of review results and tracking of remedial action\n NOTE: • Human resource background checking where appropriate and legally permitted.",

    "Your enterprise's data acquisition controls are well-maintained. As a reminder, at a minimum, the process for managing such controls should address: \n• Identification of organisational processes that may intentionally or incidentally acquire personal data\n•  Documentation of inbound data flows and data interfaces (i.e., written, web, other)\n•  Identification of data origin where possible (i.e., direct from data subject, controller, processor, other supply chain actors, etc.)\n•  Documentation of related controls in the internal controls register.",

    "Your enterprise's processing controls are well-maintained. As a reminder, the process of maintaining such controls should cover:\n•  Identification of process steps, inputs and outputs that are to be controlled\n•  Identification of handover points to third parties, e.g., processors or authorities\n•  Definition of control objectives and control types (e.g., preventive, detective, corrective)\n•  Documentation of related controls in the internal controls register.",

    "Your enterprise's storage controls are well-maintained. As a reminder, the process of maintaining such controls should cover at least:\n•  Identification of storage types and locations for personal data, i.e., storage map\n•  Analysis of storage instances within the overall IT architecture\n•  Identification of external storage instances, e.g., third party, virtualised, cloud\n•  Identification and mapping of handover points between core processes (data in flow) and storage (data at rest)\n•  Documentation of related controls in the internal controls register.",

    "Your enterprise's deletion controls are well-maintained. As a reminder, the process for maintaining deletion controls should cover at least:\n• Identification of deletion points within the overall system\n• Mapping of controls prior to deletion\n• Maintaining a deletion log\n• Mapping of controls after deletion\n• Verification of removal from the personal data register\n• Documentation of related controls in the internal controls register.",

    "Your enterprise's monitoring controls are well-maintained. As a reminder, the process for maintaining monitoring controls should cover at least:\n• Mapping of personal data processing to overall monitoring, including tools\n•  Identification of monitoring needs across the process register\n• Mapping of reporting needs and application to monitoring processes\n• Recurring review of monitoring density and extent\n• Documentation of related controls in the internal controls register.",

    "Your enterprise is well-prepared to manage independent reviews. As a reminder, managing independent reviews further requires planning steps similar to standard reviews, including notification, fieldwork, analysis and reporting. Data Protection and Privacy (DPP) practitioners and enterprises may benefit from leveraging standardised audit and review processes for Data Protection and Privacy (DPP) reviews. They should further link to the minimum structure and content of Data Protection Officer (DPO) reporting as set down in established privacy and data protection regulations.",

  ];
}


function returnFA_P(l) {
  return ["Sua empresa está bem preparada nesta área. Quando apropriado, a estrutura de governança deve fazer referência a políticas e procedimentos existentes vinculados ao processamento de dados pessoais (por exemplo, a política de segurança da informação ou a política de gerenciamento de identidade e acesso). Da mesma forma, os conceitos organizacionais e técnicos de uma estrutura de governança e acordos associados devem ser referenciados para garantir consistência (por exemplo, quaisquer esquemas de classificação de dados existentes ou a determinação dos níveis de proteção de ativos de informações). ",

    "Os elementos de governança em torno de um registro de processamento incluem, mas não estão limitados a: \n • Ativos de informações usados ​​(do registro de dados pessoais) \n• Objetivo (s) de processar Processos de negócios ou outros processos organizacionais que utilizam os ativos \n• Vida útil do processamento ciclo da aquisição inicial de dados à exclusão de dados (planejado ou ad hoc) \n• O processo de governança em torno do registro de processamento deve definir ainda mais uma função ou função responsável por manter o registro, bem como a acessibilidade do registro para análises internas e externas. Outras disposições de governança podem incluir o escopo e o procedimento para apresentar o registro como evidência, interna e externamente. Em situações em que o processamento complexo de grandes quantidades de dados pessoais ocorra, o registro deve ser regido por uma política ou procedimento operacional chave apropriado. ",


    "Sua empresa está indo bem nesta área. Uma empresa deve estabelecer, manter, monitorar e adaptar continuamente regras corporativas vinculativas que reflitam adequada e abrangente a estrutura de governança interna e externa. As atividades em conjunto com as regras corporativas vinculativas (políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto em um grupo de empreendimentos ou empresas.) Incluem, mas não se limitam a: \n• Definição, descrição e aprovação de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. pela gerência sênior \n• Comunicação de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. \n• Validação e atualização anual ou ad hoc de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. \n• Integração de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto em um grupo de empresas ou empresas. em relações contratuais de terceiros \n• Monitoramento de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas.conformidade interna e externa ",

    "As regras de consentimento da sua empresa estão bem definidas e comunicadas. No mínimo, as disposições de governança em torno do consentimento devem abranger: \n• Transparência e permitir informações aos titulares dos dados \n • Tipos de consentimento e requisitos relacionados \n• Retirada do consentimento dos titulares dos dados \n• Processos, controles e verificações específicas para crianças consentimento, incluindo verificação adequada da idade e / ou autoridade dos pais, bem como dos canais de comunicação dos pais, simplicidade de linguagem e acessibilidade das interfaces baseadas em consentimento",


    "Sua empresa está bem equipada para processar solicitações de titulares de dados. No mínimo, as disposições de governança em relação às solicitações dos titulares de dados devem abranger: \n• Receber e documentar solicitações dos titulares de dados \n• Validação de solicitações relacionadas a objetivos, legal e técnica \n• Resposta formal, incluindo canais e formatos de comunicação \n• Interfaces para processos internos e da cadeia de suprimentos \n• Interface para registro de dados pessoais e registro de processamento \n• Revisão independente de solicitações pela função Data Protection Officer ",


    "Sua empresa é eficaz no tratamento de reclamações de titulares de dados. No mínimo, as disposições de governança em torno das reclamações dos titulares dos dados devem abranger: \n• Recebimento e documentação inicial, incluindo qualquer resposta formal às autoridades de supervisão \n• Análise de reclamações, incluindo interfaces organizacionais, legais e técnicas dentro da empresa \n• Definição e implementação de soluções, quando aplicável \n• Identificação de possíveis lacunas ou deficiências que levem à reclamação e oportunidades de melhoria ",


    "Sua empresa possui um processo bem governado para garantir uma supervisão imparcial. As atividades em conjunto com a supervisão imparcial incluem, mas não se limitam a: \n • Funções organizacionais que executam e garantem supervisão imparcial \n• Funções e responsabilidades (RACI), incluindo imparcialidade demonstrada \n• Objetivos, escopo e extensão das atividades de supervisão \n• Frequência baseada em riscos das atividades de supervisão \n• Procedimentos e orientações para planejamento, implantação e geração de relatórios ",


    "Sua empresa está bem preparada nesta área. No mínimo, as seguintes partes do ciclo devem ser definidas e implementadas: \n• Criação ou aquisição de dados, incluindo a cadeia de processamento de dados pessoais (suprimento) \n• Classificação de ativos de informações, incluindo níveis de proteção e atribuição a categorias especiais \n• Inclusão no registro de dados pessoais e no processamento e remoção de registros \n• Processamento real e controles relacionados \n• Armazenamento temporário e permanente, incluindo armazenamento virtualizado e em nuvem \n• Arquivamento e agregação \n• Exclusão, ambas planejadas ( fim da vida útil ou fim da finalidade) e ad hoc (solicitação de apagamento etc.)",


    "Sua empresa está fazendo um excelente trabalho na identificação e documentação de dados pessoais. O processo de identificação deve, no mínimo, abordar os seguintes aspectos: \n• Definição de critérios de acordo com seus critérios de privacidade e proteção de dados \n• Procedimento para analisar conjuntos de dados existentes, possivelmente em combinação com a análise dos níveis de proteção de segurança (CIA) \n• Procedimento de entrega para registro de dados pessoais \n• Análise de inferência potencial (identificação indireta de pessoas físicas) de conjuntos de dados separados e / ou dispersos \n• Procedimento de integração para novos dados \n• Procedimentos e controles para terceiros partidos",


    "Sua empresa é eficaz em manter a classificação dos dados. No mínimo, a classificação de dados pessoais deve abordar: \n• Atributo geral de \"pessoal\" de acordo com seus critérios de privacidade e proteção de dados; relevância pessoal mais ampla como PII, se necessário \n• Classificação específica relacionada a categorias e finalidades especiais, incluindo limitações e requisitos adicionais de segurança \n• Classificação em termos de não rejeição de transações envolvendo dados pessoais \n• Outros aspectos, como sigilo profissional aplicável ou critérios de acesso restrito ",


    "O registro de dados pessoais da sua empresa é muito bem mantido. No mínimo, o processo de registro de dados pessoais deve abordar: \n• Tipo de dados e agregação (se houver) em ativos de informação \n• Links relevantes entre conjuntos de dados que formam ativos de informação sob seus critérios de privacidade e proteção de dados \n• Tipos e formatos de dados, incluindo dados não mantidos em formatos eletrônicos (por exemplo, papel, microficha) \n• Localização e instanciação de dados, incluindo várias cópias, imagens virtualizadas e em nuvem, etc. \n• Informações sobre o ciclo de vida e o tempo de vida, incluindo planejado arquivamento e exclusão \n• Etapas de processamento vinculadas, unidades organizacionais e finalidades de processamento, detalhando claramente quando, por que, onde e por quem do processamento de dados pessoais ",


    "Sua empresa está bem equipada para gerenciar dados de categorias especiais. Isso requer um processo robusto que identifica, controla e documenta qualquer processamento de dados pertencentes a uma ou mais categorias especiais, abrangendo no mínimo, mas não limitado a: \n• Mapeamento de ativos de informações identificadas para categorias especiais, de acordo com seus critérios para privacidade e proteção de dados \n• Documentação de circunstâncias justificativas (de acordo com seus critérios de privacidade e proteção de dados) para cada ativo de informação \n• Documentação de qualquer classificação nova ou alterada de tais ativos de informação. NOTA: • Documentação de todas as comunicações com os titulares dos dados ou autoridades de supervisão relacionadas ao ativo de informação \n• Documentação do consentimento relacionado ao ativo e retirada do consentimento \n• Links verificados para o registro de dados pessoais e registro de processamento, incluindo evidências de processamento que é restrito ao (s) objetivo (s) definido (s)",


    "Sua empresa está bem preparada para responder às demandas de apagamento. O processo deve, no mínimo, abordar os seguintes aspectos: \n• Recepção, confirmação e análise de solicitações de apagamento por titulares de dados ou autoridades competentes \n• Validação e internalização de solicitações de apagamento transferidas por terceiros\n • Interfaces definidas para outros processos, isto é, registro de dados pessoais e processo de processamento, classificação e ciclo de vida dos dados \n• Aprovações e procedimentos de verificação independente em torno da eliminação \n• Confirmação da exclusão e procedimento de comunicação (para titulares ou autoridades de dados) ",


    "Sua empresa realizou uma avaliação de risco completa. Como lembrete, os resultados da avaliação de riscos devem incluir, no mínimo: \n• Registro abrangente de eventos e ameaças que levem aos seus critérios para categorias de risco de privacidade e proteção de dados \n• Estimativas de frequência e premissas de precaução \n• Agregação e agrupamento de eventos que levam aos mesmos riscos que se materializam \n• Classificação de risco, geralmente de acordo com o esquema organizacional de classificação geral de risk ",


    "Sua empresa realizou com sucesso uma avaliação de impacto na proteção de dados. Como lembrete, a DPIA deve levar em consideração os controles e medidas de mitigação de riscos existentes e ter como objetivo identificar o impacto potencial resultante do risco residual que não foi ou não pode ser totalmente mitigado.",


    "Sua empresa está fazendo um excelente trabalho gerenciando o tratamento de riscos. Como lembrete, o processo de tratamento de riscos deve, no mínimo, abranger o seguinte: \n• Evitar ou eliminar riscos, incluindo alterações nos arranjos de processamento ou descontinuar o processamento (reestruturar ou sair) \n• Eliminar riscos através de controles ou salvaguardas adicionais \n • Transferência de riscos, incluindo a reestruturação da cadeia de fornecimento de dados pessoais \n• Redução de riscos por meio de controles adicionais ou medidas de mitigação \n• Tolerância ao risco, com base na frequência e impacto estimados ",


    "Sua empresa possui um processo de validação robusto. Como um lembrete, no mínimo, o processo de validação de risco deve abordar: \n• Confirmação (ou alteração) dos resultados da avaliação de risco, incluindo estimativas de frequência e período razoável de observação do universo de eventos / ameaças \n• Revisão de quaisquer incidentes ou violações que pode ter ocorrido desde a última validação \n• Análise de quaisquer alterações na estrutura e nos termos de referência, ou seja, em relação a qualquer evento legislativo ou regulatório, político ou financeiro ",


    "Sua empresa está fazendo um excelente trabalho nesta área. O anonimato e a pseudonimização devem abranger, mas não estão limitados a: \n• Identificação de conjuntos de dados pessoais a serem anonimizados / pseudonimizados \n• Definição de técnicas em todos os níveis técnicos, por exemplo, arquivo, registro de banco de dados, sistemas de arquivos não eletrônicos \n• Documentação e registro do anonimato / pseudonimização real \n• Link definido para o registro de dados pessoais e o registro de processamento \n• Aplicação recursiva do princípio da necessidade de conhecimento em toda a cadeia de suprimentos; integração da necessidade real de conhecer o gerenciamento de identidades e acessos",


    "A estratégia de criptografia e seus componentes devem se basear em risco e eficiência, garantindo que seus critérios para riscos de privacidade e proteção de dados sejam totalmente compreendidos e internalizados em qualquer decisão. Sua empresa está indo muito bem nessa área. Como um lembrete, no mínimo, o processo de criptografia deve abordar: \n• Conjunto definitivo de dados pessoais e ativos de informações a serem criptografados, com base nos níveis de proteção atribuídos e nos seus critérios de risco e impacto na privacidade e proteção de dados \n• Definição de técnicas e destinos de criptografia, por exemplo, dados individuais, elementos de banco de dados, bancos de dados inteiros, transações, etc. \n• Links para técnicas e ferramentas de criptografia reconhecidas ou aprovadas, já em uso na empresa \n• Escopo, planejamento e etapas de implementação para criptografia adicional necessária para dados pessoais ",


    "Sua empresa está fazendo um excelente trabalho gerenciando os níveis de proteção. O processo em torno dos níveis de proteção de dados pessoais fornece uma interface definida (nos dois sentidos) entre a segurança geral das informações e a segurança dos dados pessoais. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada dos dados pessoais nas análises do nível de proteção. ",


    "Sua empresa possui um processo bem governado para gerenciar a resiliência. Como lembrete, no mínimo, o processo de resiliência deve abranger: \n• Criticidade de dados pessoais, geralmente expressa como uma combinação de requisitos de integridade e disponibilidade \n • Criticidade de processamento em função do tempo, isto é, período máximo tolerável de indisponibilidade, perda máxima de dados tolerável \n • Planos de recuperação para conjuntos de dados pessoais \n• Links definidos para planos gerais de continuidade de negócios e serviços de TI \n• Conceitos de backup e restauração de conjuntos de dados pessoais, vinculados a planos e procedimentos gerais de backup e restauração \n• Múltipla instanciação de conjuntos de dados pessoais que exigem alta disponibilidade, ou seja,fully resilient processing ",


    "Sua empresa está gerenciando efetivamente o acesso a dados pessoais. As restrições e limitações de acesso resultantes de requisitos de processamento de dados pessoais devem ser documentadas e alimentadas no processo geral do IAM. O processo de gerenciamento de acesso a dados pessoais, portanto, fornece uma interface (nos dois sentidos) para o IAM geral. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada de dados pessoais no gerenciamento de acesso. ",


    "Sua empresa possui um processo robusto para gerenciar testes e avaliação da segurança de dados pessoais. Como lembrete, no mínimo, o processo deve abordar: \n• Tipos de teste e avaliação, por exemplo, teste conceitual, verificação de vulnerabilidade e teste de penetração \n• Frequência do teste \n• Evidência de melhoria contínua, ou seja, progressivamente mais exigindo testes e avaliações ao longo do tempo \n• Registro de testes e proteção de evidências \n• Análise de pontos fracos e documentação de oportunidades de melhoria ",


    "Sua empresa possui um processo robusto para gerenciar controladores e processadores. Como lembrete, o processo deve abranger pelo menos: \n• Identificação de controladores primários e conjuntos, incluindo objetivos individuais ou coletivos para o processamento de dados pessoais \n• Identificação de processadores, incluindo o escopo definido e a extensão do processamento em nome de um ou mais controladores \n• Links para o registro de dados pessoais, refletindo os conjuntos de dados e a maneira como eles são tratados na cadeia de suprimentos (dados em fluxo; dados em repouso) \n• Links para o registro de processamento, refletindo os processos ou etapas do processo executadas por cada ator na cadeia de suprimentos \n • Documentação das disposições de gerenciamento e controle de fornecedores (processadores), geralmente incorporadas ao gerenciamento geral de fornecedores de uma empresa ",


    "Em cadeias de suprimentos complexas, o processo de gerenciamento de subprocessamento é um elemento essencial para garantir seus critérios de privacidade e conformidade de proteção de dados em toda a cadeia de suprimentos. Sua empresa está indo muito bem nessa área. Como lembrete, o processo de gerenciamento de subprocessos deve abranger, no mínimo: \n• Procedimento formal de solicitação aos processadores primários; divulgação de qualquer terceirização adicional \n• Documentação e registro de subprocessamento, incluindo escopo, extensão e objetivo (s) \n• Evidência de seus critérios de conformidade com a privacidade e proteção de dados, incluindo processos, controles, conceitos e resultados de revisão \n• Auditoria relatórios e outras garantias independentes, se disponíveis \n• Processamento de contratos entre processadores primários e subprocessadores ",


    "Sua empresa está indo bem nesta área. Como um lembrete, no mínimo, o processo em torno desses acordos deve abranger: \n• Definição, aprovação e implementação de acordos padronizados, incluindo modelos \n• Monitoramento regular do cumprimento \n• Planejamento e execução de revisões , principalmente sob o direito padrão de auditoria \n• Recebimento, análise e validação de evidências de terceiros para processamento em conformidade, por exemplo, relatórios de certificação e atestado \n• Revisão e atualização regulares de acordos, termos e condições de processamento, de acordo com as leis e atividade regulatória \n• Planejamento de término e saída para relacionamentos contratuais individuais ",


    "Sua empresa está bem preparada nesta área. Em uma cadeia de suprimentos com vários atores, os impactos resultantes de seus critérios para riscos de privacidade e proteção de dados podem se materializar a qualquer momento e a qualquer momento. Portanto, profissionais e empresas de DPP devem aplicar sua própria abordagem de DPIA a todas as partes da cadeia de suprimentos e documentar o feedback recebido de cada uma das partes. Isso inclui relatórios padronizados, bem como revisões ad hoc ou verificações de plausibilidade. O impacto geral deve ser agregado, com base no registro de processamento e no fluxo de dados entre os vários participantes da cadeia de suprimentos. Deve-se tomar cuidado para entender como os impactos em um local podem agravar os impactos em outras partes da cadeia de suprimentos. ",


    "Quando o processamento de dados pessoais é realizado em uma cadeia de suprimentos, os controles internos de um processador ou subprocessador devem ser tão eficazes quanto os da organização do controlador. O processo de controles da cadeia de suprimentos da empresa, bem definido, garante que este seja o caso. Como lembrete, no mínimo, o processo de controles da cadeia de suprimentos deve cobrir o seguinte: \n• Obtenção e análise de documentação de controles internos de terceiros \n• Mapeamento para o sistema de controle interno (ICS) na organização do controlador \n• Procedimentos para teste de projeto (ToD), isto é, técnicas padrão para avaliar controles \n• Procedimentos para teste de eficácia (ToE), isto é, amostragem e coleta de evidências que demonstram a eficácia dos controles de terceiros \n• Arranjos de monitoramento e revisão de logs, incluindo acessibilidade dos dados de registro, na medida em que estejam relacionados ao processamento de dados pessoais • Direitos de auditoria pontuais ou contínuos, incluindo planejamento e implantação de auditoria ",


    "Sua empresa está bem preparada para gerenciar a notificação em tempo hábil. Como um lembrete, no mínimo, o processo de notificação às autoridades de supervisão deve incluir: \n• Procedimento de coleta / investigação de informações, descrevendo a interação entre a função do Oficial de Proteção de Dados e outras partes da empresa e / ou serviços externos • Padronizado pacote de relatórios, incluindo o mínimo de critérios para o conjunto de informações sobre privacidade e proteção de dados e modelos adequados ",


    "Sua empresa está bem equipada para notificar os titulares dos dados em caso de incidente ou violação. Como um lembrete, no mínimo, o processo de notificação dos titulares dos dados deve abranger: \n• Formato e modelos de relatório padronizados, adaptados e otimizados para vários canais de comunicação (individual, grupo, público) \n• Mensagens-chave predefinidas e aprovadas expressar as ações da empresa (investigação, conseqüências, remediação, aprimoramento, etc.) \n• Responsabilidades organizacionais em relação à formulação e transmissão de mensagens-chave, por exemplo, envolvimento do departamento de comunicações, consultoria jurídica, etc. \n• Instalações de comunicação ad hoc oferecido aos titulares dos dados, por exemplo, linha de ajuda, número de telefone gratuito, site escuro etc. ",

    "Sua empresa possui um processo bem definido de gerenciamento de incidentes e crises. Da perspectiva dos profissionais de DPP e das unidades organizacionais que inicialmente descobriram a violação, o processo deve cobrir pelo menos: \n• Descrição e documentação de fatos e números conhecidos, em um formato padronizado, quando apropriado \n• Link definido para o processo geral de escalação e alerta , geralmente definido pela função de gerenciamento de crises empresariais (BCM) \n• Cenário de dados pessoais genéricos predefinidos para continuidade de negócios e gerenciamento de crises, semelhante a outros cenários especiais, como ataque cibernético, pandemia, etc. \n• Relacionamentos e canais de comunicação predefinidos com canais externos atores, ou seja, serviços externos, como especialistas em investigação ou forenses \n• Protocolo de comunicação em andamento entre unidades de linha organizacional e equipes de gerenciamento de incidentes / crises ",


    "Sua empresa está bem preparada para gerenciar evidências e reivindicações adequadamente. As violações de dados pessoais representam casos de não conformidade, mas também indicam que negligência interna e / ou externa ou atividade criminosa pode estar presente. O processo de evidência e reclamações deve, portanto, abranger, no mínimo: \n• Procedimentos definidos para coletar e proteger evidências, incluindo cadeia de custódia \n• Disponibilidade de serviços especializados, como forense de TI \n• Procedimento e modelos para análise pós-incidente e relatórios \n• Procedimento para fundamentar reivindicações contra terceiros, incluindo a base legal ou contratual de tais reivindicações \n• Procedimento para preparar defesas contra reivindicações de terceiros, incluindo aspectos de apelação (decisões regulatórias) \n• Link definido para postar incidentes Responsável pela proteção de dados ",


    "Sua empresa está fazendo um bom trabalho mantendo a consciência da empresa. No mínimo, o processo de conscientização em toda a empresa deve abranger: \n• Definição e descrição de seus critérios para requisitos de privacidade e proteção de dados nos processos organizacionais diários, incluindo exemplos de processamento de dados pessoais \n• Materiais de campanha enfatizando aspectos específicos de DPP, processamento de dados pessoais e seus critérios para pontos relacionados à privacidade e à proteção de dados a serem observados \n • Planos de programas / projetos que definem datas-alvo para medidas de conscientização \n• Materiais de conscientização de terceiros e detalhes sobre como incluir terceiros na conscientização campanhas ",


    "A proteção de dados e o gerenciamento de privacidade, incluindo o contexto de seus critérios de privacidade e proteção de dados, exigem um conjunto de habilidades e qualificações que devem estar presentes na empresa ou contratadas por meio de serviços externos. O gerenciamento de habilidades e educação é um processo essencial para garantir que seus critérios de privacidade e proteção de dados e suas conseqüências sejam totalmente compreendidos. Sua empresa está indo muito bem nessa área. Como lembrete, o processo de habilidades e educação deve incluir, mas não se limitar a: \nNOTA: • Definição de habilidades, níveis e requisitos internos para tarefas e posições relacionadas ao DPP \nNOTA: • Mapeamento de habilidades para cargos e funções organizacionais (matriz) \n• Identificação de níveis de qualificação adequados e qualificações ou certificações formais, conforme necessário para cada parte da matriz \n• Caminhos de educação para diferentes funções e funções organizacionais no DPP \n• Reunindo fontes educacionais, materiais e oportunidades apropriados para guiado ou auto-estudo",


    "Sua empresa possui um processo de treinamento robusto e eficaz. O treinamento é um componente importante da conscientização geral, oferecendo oportunidades contínuas de aprendizado e reforçando as principais mensagens sobre o DPP e seus critérios de privacidade e proteção de dados. No mínimo, o processo de treinamento deve abranger: \n    • Definidos e validados seus critérios básicos para treinamento em privacidade e proteção de dados, preferencialmente obrigatórios para todos os membros da empresa \n• Conceito de treinamento baseado na matriz de habilidades e educação \n• Treinamento plano, normalmente anualmente, incluindo oportunidades de treinamento interno e externo \n• Preparação de materiais de treinamento para estudo guiado e auto-estudo \n• Auxílios de treinamento preparatório para qualificações mais altas no DPP e seus critérios de privacidade e proteção de dados, incluindo preparação para exames de certificação, etc. \n• Defina fontes e provedores externos de treinamento para fins específicos, por exemplo, treinamento jurídico ou de proteção de dados ",


    "Sua empresa possui uma função bem estabelecida de responsável pela proteção de dados. Como lembrete, no mínimo, o processo de manutenção e execução do Responsável pela proteção de dados deve abranger o seguinte: \n• Estrutura organizacional e posicionamento da função de Responsável pela proteção de dados, incluindo o escritório do Responsável pela proteção de dados e seus pontos de contato em outros locais. partes da empresa \n• Projeto de tarefas e processos administrativos para a função de Oficial de Proteção de Dados \n• Projeto de programa de trabalho regular em um ciclo anual \n• Planejamento de recursos humanos, habilidades e necessidades educacionais ",


    "Sua empresa está indo bem gerenciando o orçamento e os recursos da função do Data Protection Officer. Como lembrete, o processo de orçamento e recursos deve abranger pelo menos:\nCiclo financeiro anual, vinculando-o ao orçamento geral \nPlaneamento de recursos humanos e de funcionários \nPlanejamento de recursos técnicos, incluindo ferramentas, licenciamento etc. \nPlanejamento e orçamento de serviços externos, por exemplo , para consultores ou consultores jurídicos \n• Links para relatórios financeiros gerais da empresa ",


    "Você tem uma representação excepcional da função do Data Protection Officer na empresa em geral. Como lembrete, o processo de gerenciamento de interfaces organizacionais deve cobrir pelo menos: \n• Documentação de contatos regulares e formais em toda a empresa \n• Participação do Data Protection Officer em comitês permanentes e outras reuniões institucionais formais \n• Comunicações regulares entre os dados Função do Officer de proteção e outras unidades organizacionais, incluindo atas e outros relatórios \nNOTA: • Etapas do processo documentadas que exigem o envolvimento do Officer de proteção de dados, incluindo consulta e informação (RACI) ",


    "Os relatórios internos e externos formais são uma parte importante da função de Responsável pela proteção de dados. Sua empresa está indo muito bem nessa área. Como lembrete, no mínimo, o processo de gerenciamento de relatórios deve abranger: \n• Agendamentos de relatórios para relatórios internos e externos para e pela função Responsável pela proteção de dados \n • Procedimentos que especificam modelos de relatório, conteúdo formal, frequência e distribuição, bem como Classificações da CIA para relatórios \n• Procedimento de rastreamento para geração de relatórios, cobrindo todas as programações de relatórios ",


    "Sua empresa está bem posicionada para gerenciar seus critérios de conformidade de privacidade e proteção de dados e requisitos relacionados, contratados por meio de serviços externos. Como lembrete, o processo de gerenciamento de serviços externos deve abordar, no mínimo: \n• Finalidade e substância dos serviços externos, incluindo um contrato de processamento \n• Nível de proteção definido e acordado para os serviços prestados, especificando confidencialidade, integridade e disponibilidade \n• Análise de risco do fornecedor, incluindo verificações detalhadas e due diligence, quando apropriado \n• Análise de segurança da informação \n• Direito de auditar, analisar os resultados da revisão e rastrear as ações corretivas \nNOTA: • Verificação de histórico de recursos humanos, quando apropriado e legalmente permitido ",


    "Os controles de aquisição de dados da sua empresa estão bem conservados. Como um lembrete, no mínimo, o processo para gerenciar esses controles deve abordar: Identificação de processos organizacionais que podem intencionalmente ou acidentalmente adquirir dados pessoais \n• Documentação de fluxos de dados de entrada e interfaces de dados (por exemplo, escritos, web, outros) \n• Identificação da origem dos dados sempre que possível (ou seja, diretamente do titular dos dados, controlador, processador, outros atores da cadeia de suprimentos, etc.) \n• Documentação dos controles relacionados no registro de controles internos ",


    "Os controles de processamento da sua empresa estão bem conservados. Como lembrete, o processo de manutenção de tais controles deve abranger: \n• Identificação das etapas do processo, entradas e saídas que devem ser controladas \n• Identificação de pontos de transferência para terceiros, por exemplo, processadores ou autoridades \n• Definição de objetivos e tipos de controle (por exemplo, preventivo, detetive, corretivo) \n• Documentação dos controles relacionados no registro de controles internos ",


    "Os controles de armazenamento da sua empresa estão bem conservados. Como lembrete, o processo de manutenção de tais controles deve abranger pelo menos: \n• Identificação de tipos e locais de armazenamento de dados pessoais, como mapa de armazenamento \n• Análise de instâncias de armazenamento na arquitetura geral de TI \n• Identificação de fontes externas instâncias de armazenamento, por exemplo, de terceiros, virtualizadas, nuvem \n• Identificação e mapeamento de pontos de transferência entre processos principais (dados em fluxo) e armazenamento (dados em repouso) \n• Documentação de controles relacionados no registro de controles internos ",


    "Os controles de exclusão da sua empresa estão bem conservados. Como lembrete, o processo para manter os controles de exclusão deve abranger pelo menos: \n• Identificação dos pontos de exclusão no sistema geral \n• Mapeamento dos controles antes da exclusão \n• Manutenção de um log de exclusão \n•Mapa dos controles após a exclusão \n• Verificação da remoção do registro de dados pessoais \n• Documentação dos controles relacionados no registro de controles internos ",


    "Os controles de monitoramento da sua empresa estão bem conservados. Como lembrete, o processo para manter os controles de monitoramento deve abranger pelo menos: \n• Mapeamento do processamento de dados pessoais para o monitoramento geral, incluindo ferramentas \n• Identificação das necessidades de monitoramento no registro do processo \n• Mapeamento das necessidades de relatórios e aplicativos para processos de monitoramento \n• Revisão recorrente da densidade e extensão do monitoramento \n• Documentação dos controles relacionados no registro de controles internos ",


    "Sua empresa está bem preparada para gerenciar avaliações independentes. Como lembrete, o gerenciamento de revisões independentes requer etapas de planejamento semelhantes às revisões padrão, incluindo notificação, trabalho de campo, análise e relatório. Os profissionais e empresas do DPP podem se beneficiar da alavancagem de processos padronizados de auditoria e revisão para análises do DPP. Eles devem ainda vincular-se à estrutura e ao conteúdo mínimos dos relatórios do Data Protection Officer, conforme estabelecido em seus critérios de privacidade e proteção de dados. ",

  ];
}


function returnLA_E() {
  return ["Some additional effort would further enhance the governance framework. The aim should be to further improve where necessary so that the framework is consistent with existing policies and procedures that are linked to personal data processing (for example, the information security policy or the identity and access management policy).  An audit to ensure that all organisational and technical concepts and arrangements are referenced should be completed.",

    "Minor improvements may be needed to your enterprise's processing register. Governance elements around a processing register include, but are not limited to: \n•  Information assets used (from personal data register) \n•  Purpose(s) of processing \n•  Business processes or other organisational processes utilizing the assets \n•  processing life cycle from initial data acquisition to data deletion (planned or ad hoc) The governing process around the processing register should further define a role or function responsible for maintaining the register, as well as accessibility of the register to internal and external reviews. Further governance provisions might include the scope and procedure for presenting the register as evidence, both internally and externally. In situations where complex processing of large amounts of personal data takes place, the register should be governed by a policy or appropriate key operating procedure.",

    "Your enterprise may need to make some improvements in this area. An enterprise should establish, maintain, continuously monitor and adapt binding corporate rules that adequately and comprehensively reflect the internal and external governance framework. Activities in conjunction with BCRs include, but are not limited to: \n•  Definition, description and approval of BCRs by senior management \n•  Communication of BCRs on an enterprise-wide basis \n•  Annual or ad hoc validation and updating of BCRs \n•  Integration of BCRs in third-party contractual relationships \n•  Monitoring of BCR conformance internally and externally.",

    "Your enterprise's rules for consent may need minor enhancements. At a minimum, governance provisions around consent should cover: \n•  Transparency and enabling information to data subjects \n•  Types of consent and related requirements \n•  Withdrawal of consent by data subjects \n•  Specific processes, controls and verification for child consent, including appropriate verification of age and/or parental authority as well as parental consent \n•  Communication channels, simplicity of language and accessibility of consent-based interfaces",

    "Your enterprise is moderately equipped to process data subject requests. At a minimum, governance provisions around data subjects requests should cover: \n•  Receiving and documenting data subject requests \n•  Purpose-related, legal and technical validation of requests \n•  Formal response, including communications channels and formats \n•  Interfaces to internal and supply chain processes \n•  Interface to personal data register and processing register \n•  Independent review of requests by the DPO function",

    "Acquire, identify and classify personal data\n Some Areas to Improve\n Your enterprise should make some enhancements in order to better address data subjects' complaints. At a minimum, governance provisions around data subject's complaints should cover: \n•  Receipt and initial documentation, including any formal response to supervisory authorities \n•  Complaint analysis, including organisational, legal and technical interfaces within the enterprise \n•  Definition and implementation of remediation where applicable \n•  Identification of potential gaps or weaknesses leading to the complaint and opportunities for improvement",

    "Your enterprise should make minor adjustments to the governance process to ensure impartial oversight. Activities in conjunction with impartial oversight include, but are not limited to:  \n•  Organisational roles performing and ensuring impartial oversight  \n•  Roles and responsibilities (RACI), including demonstrated impartiality  \n•  Objectives, scope and extent of oversight activities \n•  Risk-based frequency of oversight activities \n•  Procedures and guidance for planning, deploying and reporting \n•  The acquisition of new personal data, identification of existing personal data and classification of information assets form the basis for managing and controlling such data in accordance with established privacy and data protection regulations. Data Protection and Privacy (DPP) practitioners and enterprises must therefore provide a robust process that ensures  privacy and data protection regulation, conformant processing as well as efficient data management. This process should also establish a defined and measurable life cycle for personal data, taking into account the principle of data minimisation.",

    "Some additional effort would be useful in this area. At a minimum, the following parts of the cycle should be defined and implemented: \n•  Data creation or acquisition, including the personal data processing (supply) chain \n•  Information asset classification, including protection levels and assignment to special categories \n•  Inclusion in the personal data register and the processing register and removal from registers \n•  Actual processing and related controls \n•  Temporary and permanent storage, including virtualised and cloud storage \n•  Archiving and aggregation \n•  Deletion, both planned (end of life or end of purpose) and ad hoc (erasure request, etc.)",

    "Minor improvements may be needed to your enterprise's process to identify and document personal data. The identification process should, at a minimum, address the following aspects: \n•  Definition of criteria in accordance with established privacy and data protection regulations \n•  Procedure for analysing existing data sets, possibly in combination with the analysis of security protection levels Confidentiality, Integrity and Availability (CIA) \n•  Handover procedure to personal data register \n•  Analysis of potential inference (indirect identification of natural persons) from separate and/or dispersed data sets \n•  Onboarding procedure for new data \n•  Procedures and controls for third parties.",

    "Your enterprise should make some enhancements in order to better Maintain Data Classification. At a minimum, personal data classification should address: \n•  General attribute of personal in accordance with established privacy and data protection regulations; wider personal relevance as Personally Identifiable Information (PII) if needed \n•  Specific classification relating to special categories and purposes, including limitations and additional security requirements \n•  Classification in terms of nonrepudiation of transactions involving personal data \n•  Other aspects, such as applicable professional secrecy or restricted access criteria",

    "Your enterprise's personal data register is generally well-maintained. At a minimum, the personal data register process should address: \n•  Type of data and aggregation (if any) into information assets \n•  Relevant links between data sets that form information assets under established privacy and data protection regulations \n•  Data types and formats, including data not held in electronic formats (e.g., paper, microfiche) \n•  Data location and instantiation, including multiple copies, virtualised and cloud images, etc. \n•  Life cycle and life span information, including planned archiving and deletion \n•  Linked processing steps, organisational units and processing purposes, clearly detailing the when, why, where and by whom of personal data processing",

    "Your enterprise is moderately well-equipped to manage special categories data. This requires a robust process that identifies, controls and documents any processing of data belonging to one or more special categories, covering at a minimum, but not limited to: \n•  Mapping of identified information assets to special categories in accordance with established privacy and data protection regulations \n•  Documentation of justifying circumstances (as per established privacy and data protection regulations) for each information asset \n•  Documentation of any new or changed classification of such information assets \n•  Documentation of all communications with data subjects or supervisory authorities as relating to the information asset \n•  Documentation of asset-related consent and withdrawal of consent \n•  Verified links to personal data register and processing register, including evidence of processing that is restricted to the defined purpose(s).",

    "Your enterprise is generally prepared to respond to demands for erasure. The process should, at a minimum, address the following aspects: \n•  Receipt, confirmation and analysis of erasure requests by data subjects or competent authorities \n•  Validation and internalization of erasure requests transferred by third parties \n•  Defined interfaces to other processes, i.e., personal data register and processing register, data classification and data life cycle \n•  Approvals and independent-verification procedures around erasure \n•  Erasure confirmation and communications procedure (to data subjects or authorities).",

    "Personal data processing is subject to a number of predefined risks that must be identified, evaluated and treated in an adequate and appropriate manner. The potential impact of these risks must be assessed and analyzed in view of existing risk mitigation measures. The risk management process must further manage residual risk, using recognized tools and standards. Your enterprise may want to review your risk evaluation. The results of the risk evaluation should include, at a minimum: \n•  Comprehensive register of events and threats leading to privacy and data protection risk categories \n•  Frequency estimates and precautionary assumptions \n•  Aggregation and clustering of events leading to the same risks materialising \n•  Risk classification, usually in accordance with the overarching organisational risk classification scheme.",

    "Your enterprise may want to review your Data Protection Impact Assessment (DPIA) for deficiencies. The Data Protection Impact Assessment (DPIA) must take into account existing controls and risk mitigation measures, and aim at identifying the potential impact resulting from the residual risk that has not been or cannot be fully mitigated.",

    "Your enterprise is doing an adequate job managing risk treatment. As a reminder, the risk treatment process should, at a minimum, cover the following: \n•  Risk avoidance or elimination, including changes to processing arrangements or discontinuation of processing (restructure or exit) \n•  Risk elimination through additional controls or safeguards \n•  Risk transfer, including restructuring of the personal data supply chain \n•  Risk reduction through additional controls or mitigation measures \n•  Risk tolerance, based on the estimated frequency and impact.",

    "Your enterprise may want to consider minor enhancements to the risk validation process. At a minimum, the risk validation process should address: \n•  Confirmation (or change) of risk evaluation results, including frequency estimates and the event/threat universe \n•  Review of effectiveness of treatment measures and activities, based on a reasonable period of observation \n•  Review of any incidents or breaches that may have occurred since the last validation \n•  Analysis of any changes to the framework and terms of reference, i.e., in respect of any legislative or regulatory, political or financial events.",

    "Your enterprise is doing moderately good work in this area. Anonymisation and pseudonymisation should cover, but are not limited to: \n•  Identification of personal data sets to be anonymized/pseudonymized \n•  Definition of techniques at all technical levels, e.g., file, database record, non electronic filing systems \n•  Documentation and log of actual anonymisation/pseudonymisation \n•  Defined link to personal data register and processing register \n•  Recursive application of the need-to-know principle across the supply chain; integration of the actual need to know with identity and access management.",

    "The encryption strategy and its components should be based on risk and efficiency, making sure that  privacy and data protection risks are fully understood and internalised in any decision. Your enterprise is generally doing well in this area. As a reminder, at a minimum, the encryption process should address: \n•  Definitive set of personal data and information assets to be encrypted, based on the assigned protection levels and the  privacy and data protection risks and impacts \n•  Definition of encryption techniques and targets, e.g., individual data, database elements, whole databases, transactions, etc. \n•  Links to recognized or approved encryption techniques and tools already in use within the enterprise \n•  Scope, plan and implementation steps for additional encryption needed for personal data.",

    "Your enterprise could make minor enhancements to better manage protection levels. The process around protection levels for personal data provides a defined interface (both ways) between general information security and personal data security. Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in protection level analyses.",

    "Your enterprise is moderately prepared to manage resilience. At a minimum, the resilience process should cover: \n•  Personal data criticality, often expressed as a combination of integrity and availability requirements \n•  Processing criticality as a function of time, i.e., maximum tolerable period of unavailability, maximum tolerable data loss \n•  Recovery plans for personal data sets \n•  Defined links to general business continuity and IT service continuity plans \n•  Backup and restore concepts for personal data sets, linked to overall backup and restore plans and procedures \n•  Multiple instantiations of personal data sets requiring high availability, i.e., fully resilient processing.",

    "Your enterprise is somewhat effectively managing access to personal data. Access restrictions and limitations resulting from personal data processing requirements should be documented and fed into the general Identity and Access Management (IAM) process. The access management process for personal data, therefore, provides an interface (both ways) to general Identity and Access Management (IAM). Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in access management.",

    "Your enterprise generally has a good process in place to manage testing and assessment of personal data security. As a reminder, at a minimum, the process should address: \n•  Types of test and assessment, e.g., conceptual testing, vulnerability scanning and penetration testing \n•  Frequency of testing \n•  Evidence of continual improvement, i.e., progressively more demanding tests and assessments over time \n•  Test logging and securing evidence \n•  Analysis of weaknesses and documentation of improvement opportunities.",

    "Your enterprise has a generally adequate process in place for managing controllers and processors. As a reminder, the process should cover at least: \n•  Identification of primary and joint controllers, including individual or collective purpose(s) for processing personal data \n•  Identification of processors, including the defined scope and extent of processing on behalf of one or more controllers \n•  Links to the personal data register, reflecting the data sets and the way they are handled across the supply chain (data in flow; data at rest) \n•  Links to the processing register, reflecting the processes or process steps performed by each actor in the supply chain \n•  Documentation of vendor (processor) management and control arrangements, often embedded into general vendor management of an enterprise",

    "In complex supply chains, the sub-process management process is an essential element of ensuring privacy and data protection regulation conformance across the whole supply chain. Your enterprise is doing generally well in this area. As a reminder, the sub-process management process should cover, at a minimum: \n•  Formal request procedure to primary processors; disclosure of any further outsourcing \n•  Documentation and register of subprocessing, including scope, extent and purpose(s) \n•  Evidence of  privacy and data protection regulations conformance to expected norms, including processes, controls, concepts and review results \n•  Audit reports and other independent assurance, if available \n•  Processing agreements between primary processors and sub-processors",

    "While your enterprise is doing generally well in this area, minor enhancements could increase process effectiveness. At a minimum, the process around these agreements should cover: \n•  Definition, approval and roll-out of standardised agreements, including templates \n•  Monitoring of fulfilment on a regular basis \n•  Planning and execution of reviews, primarily under the standard right to audit \n•  Receipt, analysis and validation of third-party evidence for conformant processing, e.g., certification and attestation reports \n•  Regular review and updating of processing agreements, terms and conditions, in line with legislative and regulatory activity \n•  Termination and exit planning for individual contractual relationships",

    "Your enterprise is somewhat prepared in this area. In a supply chain with multiple actors, impacts resulting from  privacy and data protection risks may materialise at any point and at any time. Therefore, Data Protection and Privacy (DPP) practitioners and enterprises should apply their own Data Protection Impact Assessment (DPIA) approach to all parts of the supply chain and document the feedback received from each of the parties. This includes standardised reporting as well as ad hoc reviews or plausibility checks. The overall impact should then be aggregated based on the processing register and the flow of data across various supply chain participants. Care should be taken in understanding how impacts in one place may aggravate impacts in other parts of the supply chain.",

    "Where personal data processing is performed in a supply chain, internal controls at a processor or sub-processor must be as effective as the ones within the controller organisation. Your enterprise's supply chain controls process is key to ensure that this is the case. At a minimum, the process should cover the following: \n•  Obtaining and analysing internal controls documentation from third parties \n•  Mapping supply chain controls to the internal control system (ICS) at the controller organisation \n•  Procedures for test of design (ToD), i.e., standard techniques for evaluating controls \n•  Procedures for test of effectiveness (ToE), i.e., sampling and collecting evidence that demonstrates the effectiveness of controls at third parties \n•  Monitoring and log review arrangements, including the accessibility of log data in as much as these, relate to personal data processing \n•  Point-in-time or continuous audit rights, including audit planning and deployment",

    "Where personal data processing is performed in a supply chain, internal controls at a processor or sub-processor must be as effective as the ones within the controller organisation. Your enterprise's supply chain controls process is key to ensure that this is the case. At a minimum, the process should cover the following: \n•  Obtaining and analysing internal controls documentation from third parties \n•  Mapping supply chain controls to the internal control system (ICS) at the controller organisation \n•  Procedures for test of design (ToD), i.e., standard techniques for evaluating controls \n•  Procedures for test of effectiveness (ToE), i.e., sampling and collecting evidence that demonstrates the effectiveness of controls at third parties \n•  Monitoring and log review arrangements, including the accessibility of log data in as much as these, relate to personal data processing \n•  Point-in-time or continuous audit rights, including audit planning and deployment",

    "Your enterprise is generally equipped to notify data subjects in event of an incident or breach. As a reminder, at a minimum, the process of notifying data subjects should cover: \n•  Standardised reporting format and templates, adapted to and optimised for various channels of communication (individual, group, public) \n•  Predefined and approved key messages expressing the enterprise's actions (investigation, consequences, remediation, improvement, etc.) \n•  Organisational responsibilities with regard to formulating and conveying key messages, e.g., involvement of the communications department, legal advice, etc. \n•  Ad hoc communications facilities offered to data subjects, e.g., help line, free phone number, dark site, etc.",

    "Your enterprise's incident and crisis management process is generally adequate. From the perspective of Data Protection and Privacy (DPP) practitioners and organisational units initially discovering the breach, the process should cover at least: \n•  Description and documentation of known facts and figures, in a standardised format where appropriate \n•  Defined link to general escalation and alerting process, often defined by the business crisis management (BCM) function \n•  Predefined generic personal data scenario for business continuity and crisis management, similar to other special scenarios such as cyberattack, pandemic, etc. \n•  Predefined relationships and communications channels with external actors, i.e., external services such as investigative or forensics specialists \n•  Ongoing communications protocol between organisational line units and incident/crisis management teams.",

    "Your enterprise has still to fully complete it's work to be fully prepared to manage evidence and claims appropriately. This will minimise the risk of personal data breaches which would otherwise represent instances of noncompliance and would indicate that internal and/or external negligence or criminal activity may have been present. The evidence and claims process should therefore cover, at a minimum: \n•  Defined procedures for collecting and securing evidence, including chain of custody \n•  Availability of specialised services such as IT forensics \n•  Procedure and templates for post-incident analysis and reporting \n•  Procedure for substantiating claims against third parties, including the legal or contractual basis for such claims \n•  Procedure for preparing defences against claims by third parties, including aspects of appeal (regulatory decisions) \n•  Defined link to post-incident Data Protection Officer (DPO) reporting",

    "Your enterprise is adequately maintaining enterprise awareness. At a minimum, the enterprise-wide awareness process should cover: \n•  Definition and description of  privacy and data protection requirements in day-to-day organisational processes, including examples of personal data processing \n•  Campaign materials emphasising specific aspects of Data Protection and Privacy (DPP), personal data processing and privacy and data protection points to note \n•  Program/project plans setting target dates for awareness measures \n•  Third-party awareness materials and details on how to include third parties in awareness campaigns",

    "Data Protection and Privacy management, including the context of established privacy and data protection regulations, require a set of skills and qualifications that must be present in the enterprise or contracted through external services. The management of skills and education is an essential process to ensure that  privacy and data protection risks  and their consequences are fully understood. Your enterprise is doing generally well in this area. As a reminder, the skills and education process should include, but not be limited to: \n•  Definition of skills, levels and internal requirements for Data Protection and Privacy (DPP) related tasks and positions \n•  Mapping of skills to roles and organisational functions (matrix) \n•  Identification of suitable qualification levels and formal qualifications or certifications, as needed for each part of the matrix \n•  Education paths for different roles and organisational functions in Data Protection and Privacy (DPP) \n•  Gathering appropriate educational sources, materials and opportunities for guided or self-study.",

    "Minor modifications could enhance the effectiveness of your enterprise's training process. Training is an important component of overall awareness, providing ongoing learning opportunities and reinforcing the key messages around Data Protection and Privacy (DPP) and privacy and data protection requirements. At a minimum, the training process should cover: \n•  Defined and validated basic privacy and data protection regulations training, preferably mandatory for all members of the enterprise \n•  Training concept based on the skills and education matrix \n•  Training plan, typically on an annual basis, including internal and external training opportunities \n•  Preparation of training materials, guided study and self-study \n•  Preparatory training aids for higher qualifications in Data Protection and Privacy (DPP) and established privacy and data protection regulations, including certification exam preparation, etc. \n•  Defined external training sources and providers for specific purposes, e.g., legal or Data Protection Officer (DPO) training.",

    "Your enterprise may need slight improvements in the DPO function. As a reminder, at a minimum, the process of maintaining and running the DPO should cover the following: \n•  Organisational structure and positioning of the DPO function, including the DPO office and its points of contact in other parts of the enterprise \n•  Design of administrative tasks and processes for the DPO function \n•  Design of regular work program in an annual cycle \n•  Human resource planning, skills and education needs.",

    "Your enterprise is doing an adequate job managing the budget and resources of the DPO function. As a reminder, the budgeting and resourcing process should at least cover: \n•  Annual financial budget cycle, linking into general budgeting \n•  Human resource and headcount planning \n•  Technical resource planning, including tools, licensing, etc. \n•  External service planning and budgeting, e.g., for consultants or legal advisors \n•  Links to general financial reporting within the enterprise.",

    "Your DPO function is generally well-represented in the overall enterprise. As a reminder, the management process for organisational interfaces should cover at least: \n•  Documentation of regular, formal contacts throughout the enterprise \n•  DPO participation in standing committees and other formal institutional meetings \n•  Regular communications between the DPO function and other organisational units, including minutes and other reports \n•  Documented process steps requiring DPO involvement, including consultation and information (RACI).",

    "Formal internal and external reporting is an important part of the DPO function. Your enterprise is doing moderately well in this area. As a reminder, at a minimum, the reporting management process should cover: \n•  Reporting schedules for internal and external reporting to and by the DPO function \n•  Reporting schedules for supervisory authority reporting \n•  Procedures specifying report templates, formal content, frequency and distribution as well as Confidentiality, Integrity and Availability (CIA) ratings for reports \n•  Tracking procedure for reporting, covering all reporting schedules.",

    "Your enterprise is adequately positioned to manage  privacy and data protection regulation conformance and related requirements that are contracted through external services. As a reminder, the process for managing external services should address, at a minimum: \n•  Purpose and substance of external services, including a processing agreement \n•  Defined and agreed protection level for the services rendered, specifying confidentiality, integrity and availability \n•  Supplier risk analysis, including in-depth checks and due diligence where appropriate \n•  Information security analysis \n•  Right to audit, analysis of review results and tracking of remedial action \n•  Human resource background checking where appropriate and legally permitted.",

    "Your enterprise's data acquisition controls are somewhat well-maintained. As a reminder, at a minimum, the process for managing such controls should address: \n•  Identification of organisational processes that may intentionally or incidentally acquire personal data \n•  Documentation of inbound data flows and data interfaces (i.e., written, web, other) \n•  Identification of data origin where possible (i.e., direct from data subject, controller, processor, other supply chain actors, etc.) \n•  Documentation of related controls in the internal controls register.",

    "Your enterprise's processing controls are somewhat well-maintained. As a reminder, the process of maintaining such controls should cover: \n•  Identification of process steps, inputs and outputs that are to be controlled \n•  Identification of handover points to third parties, e.g., processors or authorities \n•  Definition of control objectives and control types (e.g., preventive, detective, corrective) \n•  Documentation of related controls in the internal controls register.",

    "Your enterprise's storage controls are somewhat well-maintained. As a reminder, the process of maintaining such controls should cover at least: \n•  Identification of storage types and locations for personal data, i.e., storage map \n•  Analysis of storage instances within the overall IT architecture \n•  Identification of external storage instances, e.g., third party, virtualised, cloud \n•  Identification and mapping of handover points between core processes (data in flow) and storage (data at rest) \n•  Documentation of related controls in the internal controls register.",

    "Your enterprise's deletion controls are somewhat well-maintained. As a reminder, the process for maintaining deletion controls should cover at least: \n•  Identification of deletion points within the overall system \n•  Mapping of controls prior to deletion \n•  Maintaining a deletion log \n•  Mapping of controls after deletion \n•  Verification of removal from the personal data register \n•  Documentation of related controls in the internal controls register.",

    "Your enterprise's monitoring controls are somewhat well-maintained. As a reminder, the process for maintaining monitoring controls should cover at least: \n•  Mapping of personal data processing to overall monitoring, including tools \n•  Identification of monitoring needs across the process register \n•  Mapping of reporting needs and application to monitoring processes \n•  Recurring review of monitoring density and extent \n•  Documentation of related controls in the internal controls register.",

    "Your enterprise is generally prepared to manage independent reviews. As a reminder, managing independent reviews further requires planning steps similar to standard reviews, including notification, fieldwork, analysis and reporting. Data Protection and Privacy (DPP) practitioners and enterprises may benefit from leveraging standardised audit and review processes for Data Protection and Privacy (DPP) reviews. They should further link to the minimum structure and content of Data Protection Officer (DPO) reporting as set down in established privacy and data protection regulations or norms.",

  ];
}


function returnLA_P() {
  return ["Estrutura de Governança Algum esforço adicional seria útil nessa área. Quando apropriado, a estrutura de governança deve fazer referência a políticas e procedimentos existentes vinculados ao processamento de dados pessoais (por exemplo, a política de segurança da informação ou a política de gerenciamento de identidade e acesso). Da mesma forma, os conceitos e disposições organizacionais e técnicos devem ser referenciados para garantir consistência (por exemplo, quaisquer esquemas de classificação de dados existentes ou a determinação dos níveis de proteção de ativos de informação).",


    "Podem ser necessárias pequenas melhorias no registro de processamento da sua empresa. Os elementos de governança em torno de um registro de processamento incluem, mas não estão limitados a: \n• Ativos de informações usados ​​(do registro de dados pessoais) \n• Finalidade (s) do processamento \n• Processos de negócios ou outros processos organizacionais que utilizam os ativos \n• Ciclo de vida do processamento, desde a aquisição inicial dos dados até a exclusão dos dados (planejado ou ad hoc) O processo de governança em torno do registro de processamento deve definir ainda mais uma função ou função responsável por manter o registro, bem como a acessibilidade do registro para análises internas e externas. Outras disposições de governança podem incluir o escopo e o procedimento para apresentar o registro como evidência, interna e externamente. Nas situações em que o processamento complexo de grandes quantidades de dados pessoais ocorre, o registro deve ser regido por uma política ou procedimento operacional chave adequado.",

    "Sua empresa pode precisar fazer algumas melhorias nesta área. Uma empresa deve estabelecer, manter, monitorar e adaptar continuamente regras corporativas vinculativas que reflitam adequada e abrangente a estrutura de governança interna e externa. Atividades em conjunto com políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. incluem, mas não estão limitados a: \n• Definição, descrição e aprovação de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. pela gerência sênior \n• Comunicação de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. \n• Validação e atualização anual ou ad hoc de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. \n• Integração de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. em relações contratuais de terceiros \n• Monitoramento de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas.conformidade interna e externa ",


    "As regras da sua empresa para obter consentimento podem precisar de pequenas melhorias. No mínimo, as disposições de governança em torno do consentimento devem abranger:\n• Transparência e permitir informações aos titulares dos dados \n• Tipos de consentimento e requisitos relacionados \n• Retirada do consentimento dos titulares dos dados \n• Processos, controles e verificações específicas para crianças consentimento, incluindo verificação apropriada da idade e / ou autoridade dos pais, bem como consentimento dos pais \n• Canais de comunicação, simplicidade de linguagem e acessibilidade de interfaces baseadas em consentimento ",

    "Sua empresa está moderadamente equipada para processar solicitações de titulares de dados. No mínimo, as disposições de governança em relação às solicitações dos titulares de dados devem abranger: \n• Receber e documentar solicitações dos titulares de dados \n• Validação técnica, legal e técnica relacionada à finalidade das solicitações \n• Resposta formal, incluindo canais e formatos de comunicação \n• Interfaces para processos internos e da cadeia de suprimentos \n• Interface para registro de dados pessoais e registro de processamento \n• Revisão independente de solicitações pela função Data Protection Officer ",


    "Adquira, identifique e classifique dados pessoais Algumas áreas a serem aprimoradas. Sua empresa deve fazer alguns aprimoramentos para melhor atender às reclamações dos titulares de dados. No mínimo, as disposições de governança em torno dos titulares de dados \n• as reclamações devem cobrir: \n• Recebimento e documentação inicial, incluindo qualquer resposta formal às autoridades de supervisão \n• Análise de reclamações, incluindo interfaces organizacionais, legais e técnicas dentro da empresa \n• Definição e implementação de reparação, quando aplicável \n• Identificação de possíveis lacunas ou deficiências que levem à reclamação e oportunidades de melhoria ",

    "Sua empresa deve fazer pequenos ajustes no processo de governança para garantir uma supervisão imparcial. As atividades em conjunto com a supervisão imparcial incluem, mas não estão limitadas a: \n• Funções organizacionais que desempenham e garantem supervisão imparcial \n• Funções e responsabilidades (RACI), incluindo imparcialidade demonstrada \n• Objetivos, escopo e extensão das atividades de supervisão \n• Frequência baseada em riscos das atividades de supervisão \n• Procedimentos e orientações para planejar, implantar e gerar relatórios \n• A aquisição de novos dados pessoais, a identificação dos dados pessoais existentes e a classificação dos ativos de informação formam a base para o gerenciamento e controle desses dados. de acordo com seus critérios de privacidade e proteção de dados. Os profissionais e empresas da DPP devem, portanto, fornecer um processo robusto que garanta seus critérios de privacidade e proteção de dados - processamento compatível, bem como gerenciamento eficiente de dados. Esse processo também deve estabelecer um ciclo de vida definido e mensurável para dados pessoais, levando em conta o princípio de minimização de dados. ",


    "Algum esforço adicional seria útil nesta área. No mínimo, as seguintes partes do ciclo devem ser definidas e implementadas: \n• Criação ou aquisição de dados, incluindo a cadeia de processamento de dados pessoais (suprimento) \n• Classificação de ativos de informações, incluindo níveis de proteção e atribuição a categorias especiais \n• Inclusão no registro de dados pessoais e no processamento e remoção de registros \n• Processamento real e controles relacionados \n• Armazenamento temporário e permanente, incluindo armazenamento virtualizado e em nuvem \n• Arquivamento e agregação \n• Exclusão, ambas planejadas ( fim da vida útil ou fim da finalidade) e ad hoc (solicitação de apagamento etc.)",

    "Podem ser necessárias pequenas melhorias no processo da sua empresa para identificar e documentar dados pessoais. O processo de identificação deve, no mínimo, abordar os seguintes aspectos: \n• Definição de critérios de acordo com seus critérios de privacidade e proteção de dados \n• Procedimento para analisar conjuntos de dados existentes, possivelmente em combinação com a análise dos níveis de proteção de segurança (CIA) \n• Procedimento de entrega para registro de dados pessoais \n• Análise de inferência potencial (identificação indireta de pessoas físicas) de conjuntos de dados separados e / ou dispersos \n• Procedimento de integração para novos dados \n• Procedimentos e controles para terceiros partidos",


    "Sua empresa deve fazer alguns aprimoramentos para manter melhor a classificação dos dados. No mínimo, a classificação de dados pessoais deve abordar: \n• Atributo geral de pessoal de acordo com seus critérios de privacidade e proteção de dados; relevância pessoal mais ampla como PII, se necessário \n• Classificação específica relacionada a categorias e finalidades especiais, incluindo limitações e requisitos adicionais de segurança \n• Classificação em termos de não rejeição de transações envolvendo dados pessoais \n• Outros aspectos, como sigilo profissional aplicável ou critérios de acesso restrito ",

    "O registro de dados pessoais da sua empresa geralmente é bem mantido. No mínimo, o processo de registro de dados pessoais deve abordar: \n• Tipo de dados e agregação (se houver) em ativos de informação \n• Links relevantes entre conjuntos de dados que formam ativos de informação sob seus critérios de privacidade e proteção de dados \n• Tipos e formatos de dados, incluindo dados não mantidos em formatos eletrônicos (por exemplo, papel, microficha) \n• Localização e instanciação de dados, incluindo várias cópias, imagens virtualizadas e em nuvem, etc. \n• Informações sobre o ciclo de vida e o tempo de vida, incluindo planejado arquivamento e exclusão \n• Etapas de processamento vinculadas, unidades organizacionais e finalidades de processamento, detalhando claramente quando, por que, onde e por quem do processamento de dados pessoais ",


    "Sua empresa está moderadamente bem equipada para gerenciar dados de categorias especiais. Isso requer um processo robusto que identifica, controla e documenta qualquer processamento de dados pertencentes a uma ou mais categorias especiais, abrangendo no mínimo, mas não limitado a: \n• Mapeamento de ativos de informações identificadas para categorias especiais, de acordo com seus critérios para privacidade e proteção de dados \n• Documentação de circunstâncias justificativas (conforme seus critérios de privacidade e proteção de dados) para cada ativo de informação \n• Documentação de qualquer classificação nova ou alterada desses ativos de informação \n• Documentação de todas as comunicações com os titulares de dados ou autoridades de supervisão relacionadas ao ativo de informação \n• Documentação do consentimento relacionado ao ativo e retirada do consentimento \n• Links verificados para o registro de dados pessoais e o registro de processamento, incluindo evidências de processamento restrito ao (s) objetivo (s) definido (s) ",

    "Geralmente, sua empresa está preparada para responder às demandas de apagamento. O processo deve, no mínimo, abordar os seguintes aspectos: \n• Recepção, confirmação e análise de solicitações de apagamento por titulares de dados ou autoridades competentes \n• Validação e internalização de solicitações de apagamento transferidas por terceiros \n• Interfaces definidas para outros processos, isto é, registro de dados pessoais e registro de processamento, classificação e ciclo de vida dos dados \n• Aprovações e procedimentos de verificação independente para eliminação • Procedimento de confirmação e comunicação de apagamento (para pessoas ou autoridades de dados) ",


    "O processamento de dados pessoais está sujeito a uma série de riscos predefinidos que devem ser identificados, avaliados e tratados de maneira adequada e apropriada. O impacto potencial desses riscos deve ser avaliado e analisado em vista das medidas existentes de mitigação de riscos. O processo de gerenciamento de riscos deve gerenciar ainda mais o risco residual, usando ferramentas e padrões reconhecidos. Sua empresa pode querer revisar sua avaliação de risco. Os resultados da avaliação de riscos devem incluir, no mínimo: \n• Registro abrangente de eventos e ameaças que levem aos seus critérios para categorias de risco de privacidade e proteção de dados \n• Estimativas de frequência e premissas de precaução \n• Agregação e agrupamento de eventos principais com os mesmos riscos que se materializam \n• Classificação de risco, geralmente de acordo com o esquema de classificação de risco organizacional abrangente ",

    "Sua empresa pode revisar seu DPIA quanto a deficiências. A DPIA deve levar em conta os controles existentes e as medidas de mitigação de risco, e deve identificar o impacto potencial resultante do risco residual que não foi ou não pode ser totalmente mitigado.",


    "Sua empresa está fazendo um trabalho adequado ao gerenciar o tratamento de riscos. Como lembrete, o processo de tratamento de riscos deve, no mínimo, abranger o seguinte: \n• Evitar ou eliminar riscos, incluindo alterações nos arranjos de processamento ou descontinuar o processamento (reestruturar ou sair) \n• Eliminar riscos através de controles ou salvaguardas adicionais \n• Transferência de riscos, incluindo a reestruturação da cadeia de fornecimento de dados pessoais \n• Redução de riscos por meio de controles adicionais ou medidas de mitigação \n• Tolerância ao risco, com base na frequência e impacto estimados ",

    "Sua empresa pode considerar pequenas melhorias no processo de validação de risco. No mínimo, o processo de validação de risco deve abordar: \n• Confirmação (ou alteração) dos resultados da avaliação de risco, incluindo estimativas de frequência e o universo de eventos / ameaças \n• Revisão da eficácia das medidas e atividades de tratamento, com base em um período razoável de observação \n• Revisão de quaisquer incidentes ou violações que possam ter ocorrido desde a última validação \n• Análise de quaisquer alterações na estrutura e nos termos de referência, ou seja, em relação a quaisquer eventos legislativos ou regulamentares, políticos ou financeiros ",


    "Sua empresa está fazendo um trabalho moderadamente bom nesta área. O anonimato e a pseudonimização devem abranger, mas não estão limitados a: \n• Identificação de conjuntos de dados pessoais a serem anonimizados / pseudonimizados \n• Definição de técnicas em todos os níveis técnicos, por exemplo, arquivo, registro de banco de dados, sistemas de arquivos não eletrônicos \n• Documentação e registro do anonimato / pseudonimização real \n• Link definido para o registro de dados pessoais e o registro de processamento \n• Aplicação recursiva do princípio da necessidade de conhecimento em toda a cadeia de suprimentos; integração da necessidade real de conhecer o gerenciamento de identidades e acessos",

    "A estratégia de criptografia e seus componentes devem se basear em risco e eficiência, garantindo que seus critérios para riscos de privacidade e proteção de dados sejam totalmente compreendidos e internalizados em qualquer decisão. Sua empresa geralmente está indo bem nessa área. Como um lembrete, no mínimo, o processo de criptografia deve abordar: \n• Conjunto definitivo de dados pessoais e ativos de informações a serem criptografados, com base nos níveis de proteção atribuídos e nos seus critérios de risco e impacto na privacidade e proteção de dados \n• Definição de técnicas e destinos de criptografia, por exemplo, dados individuais, elementos de banco de dados, bancos de dados inteiros, transações, etc. \n• Links para técnicas e ferramentas de criptografia reconhecidas ou aprovadas, já em uso na empresa \n• Escopo, planejamento e etapas de implementação para adicionais criptografia necessária para dados pessoais ",


    "Sua empresa pode fazer pequenos aprimoramentos para gerenciar melhor os níveis de proteção. O processo em torno dos níveis de proteção de dados pessoais fornece uma interface definida (nos dois sentidos) entre a segurança geral das informações e a segurança dos dados pessoais. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada dos dados pessoais nas análises do nível de proteção. ",

    "Sua empresa está moderadamente preparada para gerenciar a resiliência. No mínimo, o processo de resiliência deve cobrir: \n• Criticidade de dados pessoais, geralmente expressa como uma combinação de requisitos de integridade e disponibilidade \n• Criticidade de processamento em função do tempo, isto é, período máximo tolerável de indisponibilidade, perda máxima tolerável de dados \n• Planos de recuperação para conjuntos de dados pessoais \n• Links definidos para planos gerais de continuidade de negócios e serviços de TI \n• Conceitos de backup e restauração de conjuntos de dados pessoais, vinculados a planos e procedimentos gerais de backup e restauração \n• Instância múltipla de conjuntos de dados pessoais que exigem alta disponibilidade, ou seja, processamento totalmente resiliente ",

    "Sua empresa está gerenciando de maneira eficaz o acesso aos dados pessoais. As restrições e limitações de acesso resultantes de requisitos de processamento de dados pessoais devem ser documentadas e alimentadas no processo geral do IAM. O processo de gerenciamento de acesso a dados pessoais, portanto, fornece uma interface (nos dois sentidos) para o IAM geral. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada de dados pessoais no gerenciamento de acesso. ",


    "Sua empresa geralmente possui um bom processo para gerenciar testes e avaliações da segurança de dados pessoais. Como lembrete, no mínimo, o processo deve abordar: \n• Tipos de teste e avaliação, por exemplo, teste conceitual, verificação de vulnerabilidade e teste de penetração \n• Frequência do teste \n• Evidência de melhoria contínua, ou seja, progressivamente mais exigindo testes e avaliações ao longo do tempo \n• Registro de testes e proteção de evidências \n• Análise de pontos fracos e documentação de oportunidades de melhoria ",


    "Sua empresa possui um processo geralmente adequado para gerenciar controladores e processadores. Como lembrete, o processo deve abranger pelo menos: \n• Identificação de controladores primários e conjuntos, incluindo objetivos individuais ou coletivos para o processamento de dados pessoais \n• Identificação de processadores, incluindo o escopo definido e a extensão do processamento em nome de um ou mais controladores \n• Links para o registro de dados pessoais, refletindo os conjuntos de dados e a maneira como eles são tratados na cadeia de suprimentos (dados em fluxo; dados em repouso) \n• Links para o registro de processamento, refletindo os processos ou etapas do processo executadas por cada ator na cadeia de suprimentos \n• Documentação dos acordos de gerenciamento e controle de fornecedores (processadores), geralmente incorporados ao gerenciamento geral de fornecedores de uma empresa ",

    "Em cadeias de suprimentos complexas, o processo de gerenciamento de subprocessamento é um elemento essencial para garantir seus critérios de privacidade e conformidade de proteção de dados em toda a cadeia de suprimentos. Sua empresa geralmente está indo bem nessa área. Como lembrete, o processo de gerenciamento de subprocessos deve abranger, no mínimo: \n• Procedimento formal de solicitação aos processadores primários; divulgação de qualquer terceirização adicional \n• Documentação e registro de subprocessamento, incluindo escopo, extensão e objetivo (s) \n• Evidência de seus critérios de conformidade com a privacidade e proteção de dados, incluindo processos, controles, conceitos e resultados de revisão \n• Auditoria relatórios e outras garantias independentes, se disponíveis \n• Processamento de contratos entre processadores primários e subprocessadores ",


    "Enquanto sua empresa está indo bem nessa área, pequenos aprimoramentos podem aumentar a eficácia do processo. No mínimo, o processo em torno desses acordos deve abranger: \n• Definição, aprovação e implementação de acordos padronizados, incluindo modelos \n• Monitoramento regular do cumprimento \n• Planejamento e execução de revisões, principalmente sob o direito padrão de auditoria \n• Recebimento, análise e validação de evidências de terceiros para processamento conforme, por exemplo, relatórios de certificação e atestado \n• Revisão e atualização regulares de contratos, termos e condições de processamento, de acordo com a atividade legislativa e regulamentar \n• Planejamento de término e saída para relacionamentos contratuais individuais ",

    "Sua empresa está um pouco preparada nesta área. Em uma cadeia de suprimentos com vários atores, os impactos resultantes de seus critérios para riscos de privacidade e proteção de dados podem se materializar a qualquer momento e a qualquer momento. Portanto, profissionais e empresas de DPP devem aplicar sua própria abordagem de DPIA a todas as partes da cadeia de suprimentos e documentar o feedback recebido de cada uma das partes. Isso inclui relatórios padronizados, bem como revisões ad hoc ou verificações de plausibilidade. O impacto geral deve ser agregado, com base no registro de processamento e no fluxo de dados entre os vários participantes da cadeia de suprimentos. Deve-se tomar cuidado para entender como os impactos em um local podem agravar os impactos em outras partes da cadeia de suprimentos. ",


    "Quando o processamento de dados pessoais é realizado em uma cadeia de suprimentos, os controles internos de um processador ou subprocessador devem ser tão eficazes quanto os da organização do controlador. O processo de controle da cadeia de suprimentos da sua empresa é essencial para garantir que este seja o caso. No mínimo, o processo deve abranger o seguinte: \n• Obtenção e análise de documentação de controles internos de terceiros \n• Mapeamento para o sistema de controle interno (ICS) na organização do controlador \n• Procedimentos para teste de projeto (ToD), ou seja, técnicas padrão para avaliação de controles \n• Procedimentos para teste de eficácia (ToE), ou seja, amostragem e coleta de evidências que demonstram a eficácia dos controles de terceiros \n• Arranjos de monitoramento e revisão de logs, incluindo acessibilidade dos dados de log, na medida em que elas estão relacionadas ao processamento de dados pessoais \n• Direitos de auditoria pontuais ou contínuos, incluindo planejamento e implantação de auditoria ",


    "Quando o processamento de dados pessoais é realizado em uma cadeia de suprimentos, os controles internos de um processador ou subprocessador devem ser tão eficazes quanto os da organização do controlador. O processo de controle da cadeia de suprimentos da sua empresa é essencial para garantir que este seja o caso. No mínimo, o processo deve abranger o seguinte: \n• Obtenção e análise de documentação de controles internos de terceiros \n• Mapeamento para o sistema de controle interno (ICS) na organização do controlador \n• Procedimentos para teste de projeto (ToD), ou seja, técnicas padrão para avaliação de controles \n• Procedimentos para teste de eficácia (ToE), ou seja, amostragem e coleta de evidências que demonstram a eficácia dos controles de terceiros \n• Arranjos de monitoramento e revisão de logs, incluindo acessibilidade dos dados de log, na medida em que elas estão relacionadas ao processamento de dados pessoais \n• Direitos de auditoria pontuais ou contínuos, incluindo planejamento e implantação de auditoria ",

    "Sua empresa geralmente está equipada para notificar os titulares dos dados em caso de incidente ou violação. Como um lembrete, no mínimo, o processo de notificação dos titulares dos dados deve abranger: \n• Formato e modelos de relatório padronizados, adaptados e otimizados para vários canais de comunicação (individual, grupo, público) \n• Mensagens-chave predefinidas e aprovadas expressar as ações da empresa (investigação, conseqüências, remediação, melhoria etc.) \n• Responsabilidades organizacionais em relação à formulação e transmissão de mensagens-chave, por exemplo, envolvimento do departamento de comunicações, consultoria jurídica, etc. \n• Facilidades de comunicação ad hoc oferecidas aos titulares dos dados, por exemplo, linha de ajuda, número de telefone gratuito, site escuro, etc. ",


    "O processo de gerenciamento de incidentes e crises da sua empresa geralmente é adequado. Da perspectiva dos profissionais de DPP e das unidades organizacionais que inicialmente descobriram a violação, o processo deve cobrir pelo menos: \n• Descrição e documentação de fatos e números conhecidos, em um formato padronizado, quando apropriado \n• Link definido para o processo geral de escalação e alerta , geralmente definido pela função de gerenciamento de crises empresariais (BCM) \n• Cenário de dados pessoais genéricos predefinidos para continuidade de negócios e gerenciamento de crises, semelhante a outros cenários especiais, como ataque cibernético, pandemia, etc. \n• Relacionamentos e canais de comunicação predefinidos com canais externos atores, ou seja, serviços externos, como especialistas em investigação ou forenses \n• Protocolo de comunicação em andamento entre unidades de linha organizacional e equipes de gerenciamento de incidentes / crises ",

    "Sua empresa está adequadamente preparada para gerenciar evidências e reivindicações adequadamente. As violações de dados pessoais representam casos de não conformidade, mas também indicam que negligência interna e / ou externa ou atividade criminosa pode estar presente. O processo de evidência e reclamações deve, portanto, abranger, no mínimo: \n• Procedimentos definidos para coletar e proteger evidências, incluindo cadeia de custódia \n• Disponibilidade de serviços especializados, como forense de TI \n• Procedimento e modelos para análise pós-incidente e relatórios \n• Procedimento para fundamentar reivindicações contra terceiros, incluindo a base legal ou contratual de tais reivindicações \n• Procedimento para preparar defesas contra reivindicações de terceiros, incluindo aspectos de apelação (decisões regulatórias) \n• Link definido para postar incidentes Responsável pela proteção de dados ",


    "Sua empresa está mantendo adequadamente o conhecimento da empresa. No mínimo, o processo de conscientização em toda a empresa deve abranger: \n• Definição e descrição de seus critérios para requisitos de privacidade e proteção de dados nos processos organizacionais diários, incluindo exemplos de processamento de dados pessoais \n• Materiais de campanha enfatizando aspectos específicos de DPP, processamento de dados pessoais e seus critérios para pontos relacionados à privacidade e à proteção de dados a serem observados \n• Planos de programas / projetos que definem datas-alvo para medidas de conscientização \n• Materiais de conscientização de terceiros e detalhes sobre como incluir terceiros em campanhas de conscientização ",


    "A proteção de dados e o gerenciamento de privacidade, incluindo o contexto de seus critérios de privacidade e proteção de dados, exigem um conjunto de habilidades e qualificações que devem estar presentes na empresa ou contratadas por meio de serviços externos. O gerenciamento de habilidades e educação é um processo essencial para garantir que seus critérios de privacidade e proteção de dados e suas conseqüências sejam totalmente compreendidos. Sua empresa geralmente está indo bem nessa área. Como lembrete, o processo de habilidades e educação deve incluir, mas não se limitar a: \n• Definição de habilidades, níveis e requisitos internos para tarefas e posições relacionadas ao DPP \n• Mapeamento de habilidades para cargos e funções organizacionais (matriz) \n• Identificação de níveis de qualificação adequados e qualificações ou certificações formais, conforme necessário para cada parte da matriz \n• Caminhos de educação para diferentes funções e funções organizacionais no DPP \n• Reunindo fontes, materiais e oportunidades educacionais apropriadas para orientação ou auto-orientação -estude",

    "Pequenas modificações podem aumentar a eficácia do processo de treinamento da sua empresa. O treinamento é um componente importante da conscientização geral, oferecendo oportunidades contínuas de aprendizado e reforçando as principais mensagens sobre o DPP e seus critérios de privacidade e proteção de dados. No mínimo, o processo de treinamento deve abranger: \n• Definidos e validados seus critérios básicos para treinamento em privacidade e proteção de dados, preferencialmente obrigatórios para todos os membros da empresa \n• Conceito de treinamento baseado na matriz de habilidades e educação \n• Treinamento plano, normalmente anualmente, incluindo oportunidades de treinamento interno e externo \n• Preparação de materiais de treinamento para estudo guiado e auto-estudo \n• Auxílios de treinamento preparatório para qualificações mais altas no DPP e seus critérios de privacidade e proteção de dados, incluindo preparação para exames de certificação, etc. \n• Defina fontes e provedores externos de treinamento para fins específicos, por exemplo, treinamento jurídico ou de proteção de dados ",


    "Sua empresa pode precisar de pequenas melhorias na função do Data Protection Officer. Como lembrete, no mínimo, o processo de manutenção e execução do Responsável pela proteção de dados deve abranger o seguinte: \n• Estrutura organizacional e posicionamento da função de Responsável pela proteção de dados, incluindo o escritório do Responsável pela proteção de dados e seus pontos de contato em outros locais. partes da empresa \n• Projeto de tarefas e processos administrativos para a função de Oficial de Proteção de Dados \n• Projeto de programa de trabalho regular em um ciclo anual \n• Planejamento de recursos humanos, habilidades e necessidades educacionais ",

    "Sua empresa está fazendo um trabalho adequado ao gerenciar o orçamento e os recursos da função de Diretor de Proteção de Dados. Lembre-se de que o processo de orçamento e recursos deve abranger pelo menos: \n• Ciclo anual do orçamento financeiro, vinculando-se ao orçamento geral \n• Planejamento de recursos humanos e de funcionários \n• Planejamento técnico de recursos, incluindo ferramentas, licenciamento, etc. \n• Planejamento e orçamento de serviços externos, por exemplo, para consultores ou consultores jurídicos \n• Links para relatórios financeiros gerais dentro da empresa ",


    "Sua função de responsável pela proteção de dados geralmente está bem representada em toda a empresa. Como lembrete, o processo de gerenciamento de interfaces organizacionais deve cobrir pelo menos: \n• Documentação de contatos regulares e formais em toda a empresa \n• Participação do Data Protection Officer em comitês permanentes e outras reuniões institucionais formais \n• Comunicações regulares entre os dados Função do Protection Officer e outras unidades organizacionais, incluindo atas e outros relatórios \n• Etapas do processo documentadas que exigem o envolvimento do Officer da proteção de dados, incluindo consulta e informação (RACI) ",

    "Os relatórios internos e externos formais são uma parte importante da função de Responsável pela proteção de dados. Sua empresa está se saindo bem nessa área. Como um lembrete, no mínimo, o processo de gerenciamento de relatórios deve abranger: \n• Agendamentos de relatórios para relatórios internos e externos para e pela função Responsável pela Proteção de Dados \n• Agendamentos de relatórios para relatórios de autoridade de supervisão \n• Procedimentos que especificam modelos de relatórios, conteúdo formal, frequência e distribuição, bem como classificações da CIA para relatórios \n• Procedimento de rastreamento de relatórios, abrangendo todos os cronogramas de relatórios ",


    "Sua empresa está posicionada adequadamente para gerenciar seus critérios de conformidade de privacidade e proteção de dados e requisitos relacionados, contratados por meio de serviços externos. Como lembrete, o processo de gerenciamento de serviços externos deve abordar, no mínimo: \n• Finalidade e substância dos serviços externos, incluindo um contrato de processamento \n• Nível de proteção definido e acordado para os serviços prestados, especificando confidencialidade, integridade e disponibilidade \n• Análise de risco do fornecedor, incluindo verificações detalhadas e due diligence, quando apropriado \n• Análise de segurança da informação \n• Direito de auditar, analisar os resultados da revisão e rastrear as ações corretivas \n• Verificação de antecedentes de recursos humanos, quando apropriado e legalmente permitido ",


    "Os controles de aquisição de dados da sua empresa são bem mantidos. Como lembrete, no mínimo, o processo para gerenciar esses controles deve abordar: \n• Identificação de processos organizacionais que podem intencionalmente ou acidentalmente adquirir dados pessoais\n• Documentação de fluxos de dados de entrada e interfaces de dados (por exemplo, escritos, web, outro) \n• Identificação da origem dos dados sempre que possível (por exemplo, direto do titular dos dados, controlador, processador, outros atores da cadeia de suprimentos etc.) \n• Documentação dos controles relacionados no registro de controles internos ",

    "Os controles de processamento da sua empresa são bem mantidos. Como lembrete, o processo de manutenção de tais controles deve abranger: \n• Identificação das etapas do processo, entradas e saídas que devem ser controladas \n• Identificação de pontos de transferência para terceiros, por exemplo, processadores ou autoridades \n• Definição de objetivos e tipos de controle (por exemplo, preventivo, detetive, corretivo) \n• Documentação dos controles relacionados no registro de controles internos ",


    "Os controles de armazenamento da sua empresa são bem mantidos. Como lembrete, o processo de manutenção de tais controles deve abranger pelo menos: \n• Identificação de tipos e locais de armazenamento de dados pessoais, como mapa de armazenamento \n• Análise de instâncias de armazenamento na arquitetura geral de TI \n• Identificação de fontes externas instâncias de armazenamento, por exemplo, de terceiros, virtualizadas, nuvem \n• Identificação e mapeamento de pontos de transferência entre processos principais (dados em fluxo) e armazenamento (dados em repouso) \n• Documentação de controles relacionados no registro de controles internos ",

    "Os controles de exclusão da sua empresa são bem mantidos. Como lembrete, o processo para manter os controles de exclusão deve abranger pelo menos: \n• Identificação dos pontos de exclusão no sistema geral \n• Mapeamento dos controles antes da exclusão \n• Manutenção de um log de exclusão \n• Mapeamento dos controles após a exclusão \n• Verificação da remoção do registro de dados pessoais \n• Documentação dos controles relacionados no registro de controles internos ",

    "Manter controles de monitoramento \nOs controles de monitoramento da sua empresa são um pouco bem mantidos. Como lembrete, o processo para manter os controles de monitoramento deve abranger pelo menos: \n• Mapeamento do processamento de dados pessoais para o monitoramento geral, incluindo ferramentas \n• Identificação das necessidades de monitoramento no registro do processo \n• Mapeamento das necessidades de relatórios e aplicativos para processos de monitoramento \n• Revisão recorrente da densidade e extensão do monitoramento \n• Documentação dos controles relacionados no registro de controles internos ",


    "Realize análises independentes \nSua empresa geralmente está preparada para gerenciar análises independentes. Como lembrete, o gerenciamento de revisões independentes requer etapas de planejamento semelhantes às revisões padrão, incluindo notificação, trabalho de campo, análise e relatório. Os profissionais e empresas do DPP podem se beneficiar da alavancagem de processos padronizados de auditoria e revisão para análises do DPP. Eles devem ainda vincular-se à estrutura e ao conteúdo mínimos dos relatórios do Data Protection Officer, conforme estabelecido em seus critérios de privacidade e proteção de dados. ",

  ];
}


function returnNA_E() {
  return ["A major effort is needed in this area. Where appropriate, the governance framework should reference existing policies and procedures that are linked to personal data processing (for example, the information security policy or the identity and access management policy). Likewise, organisational and technical concepts and arrangements should be referenced to ensure consistency (for instance, any existing data classification schemes or the determination of information asset protection levels).",

    "Significant improvements are needed to your enterprise's processing register. Governance elements around a processing register include, but are not limited to: Information assets used (from personal data register) Purpose(s) of processing business processes or other organisational processes utilizing the assets Processing life cycle from initial data acquisition to data deletion (planned or ad hoc) The governing process around the processing register should further define a role or function responsible for maintaining the register, as well as accessibility of the register to internal and external reviews. Further governance provisions might include the scope and procedure for presenting the register as evidence, both internally and externally. In situations where complex processing of large amounts of personal data takes place, the register should be governed by a policy or appropriate key operating procedure.",

    "Your enterprise needs to give serious attention to improvements in this area. An enterprise should establish, maintain, continuously monitor and adapt binding corporate rules that adequately and comprehensively reflect the internal and external governance framework. Activities in conjunction with BCRs include, but are not limited to: Definition, description and approval of BCRs by senior management Communication of BCRs on an enterprise-wide basis Annual or ad hoc validation and updating of BCRs Integration of BCRs in third-party contractual relationships monitoring of BCR conformance internally and externally",

    "Your enterprise's rules for consent are lacking. At a minimum, governance provisions around consent should cover:\n• Transparency and enabling information to data subjects\n• Types of consent and related requirements\n• Withdrawal of consent by data subjects\n• Specific processes, controls and verification for child consent, including appropriate verification of age and/or parental authority as well as parental consent\n• Communication channels, simplicity of language and accessibility of consent-based interfaces",

    "Your enterprise is not prepared to process data subject requests. At a minimum,governance provisions around data subjects requests should cover:\n• Receiving and documenting data subject requests\n• Purpose-related, legal and technical validation of requests\n• Formal response, including communications channels and formats\n• Interfaces to internal and supply chain processes\n• Interface to personal data register and processing register\n• Independent review of requests by the DPO function",

    "Your enterprise is not equipped to address data subjects' complaints. At a minimum, governance provisions around data subjects’ complaints should cover: \n• Receipt and initial documentation, including any formal response to supervisory authorities\n• Complaint analysis, including organisational, legal and technical interfaces within the enterprise \n• Definition and implementation of remediation where applicable \n• Identification of potential gaps or weaknesses leading to the complaint and opportunities for improvement",

    "The organisation currently has no defined governance process to ensure impartial oversight. It is crucial for your enterprise to establish a process to ensure objective oversight. Activities in conjunction with impartial oversight include, but are not limited to: \n• Organisational roles performing and ensuring impartial oversight \n• Roles and responsibilities (RACI), including demonstrated impartiality \n• Objectives, scope and extent of oversight activities \n• Risk-based frequency of oversight activities Procedures and guidance for planning, deploying and reporting",

    "Major effort is needed in this area. At a minimum, the following parts of the cycle should be defined and implemented: \n• Data creation or acquisition, including the personal data processing (supply) chain \n• Information asset classification, including protection levels and assignment to special categories \n• Inclusion in the personal data register and the processing register and removal from registers \n• Actual processing and related controls \n• Temporary and permanent storage, including virtualised and cloud storage Archiving and aggregation Deletion, both planned (end of life or end of purpose) and ad hoc (erasure request, etc.)",

    "Significant improvements are needed to your enterprise's process to identify and document personal data. The identification process should, at a minimum, address the following aspects: \n• Definition of criteria in accordance with established privacy and data protection regulations or norms \n• Procedure for analysing existing data sets, possibly in combination with the analysis of security protection levels Confidentiality, Integrity and Availability (CIA) \n• Handover procedure to personal data register \n• Analysis of potential inference (indirect identification of natural persons) from separate and/or dispersed data sets \n• Onboarding procedure for new data \n• Procedures and controls for third parties. ",

    "Your enterprise is not equipped to Maintain Data Classification. At a minimum, personal data classification should address: \n• General attribute of “personal” in accordance with established privacy and data protection regulations or norms; wider personal relevance as Personally Identifiable Information (PII) if needed \n• Specific classification relating to special categories and purposes, including limitations and additional security requirements \n• Classification in terms of nonrepudiation of transactions involving personal data \n• Other aspects, such as applicable professional secrecy or restricted access criteria",

    "Your enterprise's personal data register needs significant improvement. At a minimum, the personal data register process should address: \n• Type of data and aggregation (if any) into information assets \n• Relevant links between data sets that form information assets under established privacy and data protection regulations or norms \n• Data types and formats, including data not held in electronic formats (e.g., paper, microfiche) \n• Data location and instantiation, including multiple copies, virtualised and cloud images, etc. \n• Life cycle and life span information, including planned archiving and deletion \n• Linked processing steps, organisational units and processing purposes, clearly detailing the when, why, where and by whom of personal data processing. ",

    "Your enterprise is not equipped to manage special categories data. This requires a robust process that identifies, controls and documents any processing of data belonging to one or more special categories, covering at a minimum, but not limited to: \n• Mapping of identified information assets to special categories in accordance with established privacy and data protection regulations or norms \n• Documentation of justifying circumstances (as per established privacy and data protection regulations or norms) for each information asset \n• Documentation of any new or changed classification of such information assets \n• Documentation of all communications with data subjects or supervisory authorities as relating to the information asset \n• Documentation of asset-related consent and withdrawal of consent \n• Verified links to personal data register and processing register, including evidence of processing that is restricted to the defined purpose(s).",

    "Your enterprise is not prepared to respond to demands for erasure. The process should, at a minimum, address the following aspects: \n• Receipt, confirmation and analysis of erasure requests by data subjects or competent authorities \n• Validation and internalization of erasure requests transferred by third parties \n• Defined interfaces to other processes, i.e., personal data register and \n• processing register, data classification and data life cycle \n• Approvals and independent-verification procedures around erasure \n• Erasure confirmation and communications procedure (to data subjects or authorities).",

    "Your enterprise should conduct a thorough risk evaluation. The results of the risk evaluation should include, at a minimum: \n• Comprehensive register of events and threats leading to privacy and data protection  risk categories \n• Frequency estimates and precautionary assumptions \n• Aggregation and clustering of events leading to the same risks materialising \n• Risk classification, usually in accordance with the overarching organisational risk classification scheme.",

    "Your enterprise must conduct a thorough data protection impact assessment. The Data Protection Impact Assessment (DPIA) must take into account existing controls and risk mitigation measures, and aim at identifying the potential impact resulting from the residual risk that has not been or cannot be fully mitigated.",

    "Your enterprise needs to make major improvements to better manage risk treatment. The risk treatment process should, at a minimum, cover the following: \n• Risk avoidance or elimination, including changes to processing arrangements or discontinuation of processing (restructure or exit) \n• Risk elimination through additional controls or safeguards \n• Risk transfer, including restructuring of the personal data supply chain \n• Risk reduction through additional controls or mitigation measures \n• Risk tolerance, based on the estimated frequency and impact. ",

    "Your enterprise needs to establish a risk validation process. At a minimum, this process should address: \n• Confirmation (or change) of risk evaluation results, including frequency estimates and the event/threat universe \n• Review of effectiveness of treatment measures and activities, based on a reasonable period of observation \n• Review of any incidents or breaches that may have occurred since the last validation \n• Analysis of any changes to the framework and terms of reference, i.e., in respect of any legislative or regulatory, political or financial events. ",

    "Your enterprise needs improvement in this area. Anonymisation and pseudonymisation should cover, but are not limited to: \n• Identification of personal data sets to be anonymized/pseudonymized \n• Definition of techniques at all technical levels, e.g., file, database record, \n• non electronic filing systems \n• Documentation and log of actual anonymisation/pseudonymisation \n• Defined link to personal data register and processing register \n• Recursive application of the need-to-know principle across the supply chain; integration of the actual need to know with identity and access management. ",

    "The encryption strategy and its components should be based on risk and efficiency, making sure that privacy and data protection  risks are fully understood and internalised in any decision. Your enterprise needs serious improvement in this area. At a minimum, the encryption process should address: \n• Definitive set of personal data and information assets to be encrypted, based on the assigned protection levels and the  privacy and data protection risks and impacts \n• Definition of encryption techniques and targets, e.g., individual data, database elements, whole databases, transactions, etc. \n• Links to recognized or approved encryption techniques and tools already in use within the enterprise \n• Scope, plan and implementation steps for additional encryption needed for personal data.",

    "Your enterprise requires major enhancements in order to manage protection levels. The process around protection levels for personal data provides a defined interface (both ways) between general information security and personal data security. Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in protection level analyses.",

    "Your enterprise does not have a mature process to manage resilience. At a minimum, the resilience process should cover: \n• Personal data criticality, often expressed as a combination of integrity and availability requirements \n• Processing criticality as a function of time, i.e., maximum tolerable period of unavailability, maximum tolerable data loss \n• Recovery plans for personal data sets \n• Defined links to general business continuity and IT service continuity plans \n• Backup and restore concepts for personal data sets, linked to overall backup and restore plans and procedures \n• Multiple instantiations of personal data sets requiring high availability, i.e., fully resilient processing.",

    "Your enterprise is not effectively managing access to personal data. Access restrictions and limitations resulting from personal data processing requirements should be documented and fed into the general Identity and Access Management (IAM) process. The access management process for personal data, therefore, provides an interface (both ways) to general Identity and Access Management (IAM). Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in access management.",

    "Your enterprise's process to manage testing and assessment of personal data security needs a serious look. At a minimum, the process should address: \n• Types of test and assessment, e.g., conceptual testing, vulnerability scanning and penetration testing \n• Frequency of testing \n• Evidence of continual improvement, i.e., progressively more demanding tests and assessments over time \n• Test logging and securing evidence \n• Analysis of weaknesses and documentation of improvement opportunities.",

    "Your enterprise's process for managing controllers and processors needs serious attention. The process should cover at least: \n• Identification of primary and joint controllers, including individual or collective purpose(s) for processing personal data \n• Identification of processors, including the defined scope and extent of processing on behalf of one or more controllers \n• Links to the personal data register, reflecting the data sets and the way they are handled across the supply chain (data in flow; data at rest) \n• Links to the processing register, reflecting the processes or process steps performed by each actor in the supply chain \n• Documentation of vendor (processor) management and control arrangements, often embedded into general vendor management of an enterprise",

    "In complex supply chains, the sub-processing management process is an essential element of ensuring established privacy and data protection regulations or norms conformance across the whole supply chain. Your enterprise needs major improvement in this area. The sub-process management process should cover, at a minimum: \n• Formal request procedure to primary processors; disclosure of any further outsourcing \n• Documentation and register of subprocessing, including scope, extent and purpose(s) \n• Evidence of established privacy and data protection regulations or norms conformance, including processes, controls, concepts and review results \n• Audit reports and other independent assurance, if available \n• Processing agreements between primary processors and sub-processors",

    "Your enterprise's processing agreements need serious work. At a minimum, the process around these agreements should cover: \n• Definition, approval and roll-out of standardised agreements, including templates \n• Monitoring of fulfilment on a regular basis \n• Planning and execution of reviews, primarily under the standard right to audit \n• Receipt, analysis and validation of third-party evidence for conformant processing, e.g., certification and attestation reports \n• Regular review and updating of processing agreements, terms and conditions, in line with legislative and regulatory activity \n• Termination and exit planning for individual contractual relationships",

    "Your enterprise has serious issues that need to be addressed in order to manage supply chain impact. In a supply chain with multiple actors, impacts resulting from privacy and data protection risks may materialise at any point and at any time. Therefore, Data Protection and Privacy (DPP) practitioners and enterprises should apply their own Data Protection Impact Assessment (DPIA) approach to all parts of the supply chain and document the feedback received from each of the parties. This includes standardised reporting as well as ad hoc reviews or plausibility checks. The overall impact should then be aggregated based on the processing register and the flow of data across various supply chain participants. Care should be taken in understanding how impacts in one place may aggravate impacts in other parts of the supply chain.",

    "Where personal data processing is performed in a supply chain, internal controls at a processor or subprocessor must be as effective as the ones within the controller organisation. Your enterprise must make major enhancements to the supply chain controls process. At a minimum, the process should cover the following: \n• Obtaining and analysing internal controls documentation from third parties \n• Mapping supply chain controls to the internal control system (ICS) at the controller organisation \n• Procedures for test of design (ToD), i.e., standard techniques for evaluating controls \n• Procedures for test of effectiveness (ToE), i.e., sampling and collecting evidence that demonstrates the effectiveness of controls at third parties \n• Monitoring and log review arrangements, including the accessibility of log data in as much as these, relate to personal data processing \n• Point-in-time or continuous audit rights, including audit planning and deployment",

    "Your enterprise is not prepared to manage notification in a timely manner. At a minimum, the process of notifying supervisory authorities should include: \n• Information gathering / investigative procedure, outlining the interaction between the Data Protection Officer (DPO) function and other parts of the enterprise and/or external services \n• Standardised reporting package including the minimum privacy and data protection regulations or norms information set and appropriate templates",

    "Your enterprise is not prepared to notify data subjects in event of an incident or breach. At a minimum, the process of notifying data subjects should cover: \n• Standardised reporting format and templates, adapted to and optimised for various channels of communication (individual, group, public) \n• Predefined and approved key messages expressing the enterprise’s actions (investigation, consequences, remediation, improvement, etc.) \n• Organisational responsibilities with regard to formulating and conveying key messages, e.g., involvement of the communications department, legal advice, etc. \n• Ad hoc communications facilities offered to data subjects, e.g., help line, free phone number, dark site, etc.",

    "Your enterprise's incident and crisis management process need serious improvement. From the perspective of Data Protection and Privacy (DPP) practitioners and organisational units initially discovering the breach, the process should cover at least: \n• Description and documentation of known facts and figures, in a standardised format where appropriate \n• Defined link to general escalation and alerting process, often defined by the business crisis management (BCM) function \n• Predefined generic personal data scenario for business continuity and crisis management, similar to other special scenarios such as cyberattack, pandemic, etc. \n• Predefined relationships and communications channels with external actors, i.e., external services such as investigative or forensics specialists \n• Ongoing communications protocol between organisational line units and incident/crisis management teams.",

    "Your enterprise has not undertaken any significant activity to demonstrate that it has adequate measures in place to manage evidence and claims appropriately. Without this the organisation will not be able to effectively deal with breaches in a legally compliant way. It will be an indication of internal and/or external negligence or criminal activity. The evidence and claims process should therefore cover, at a minimum: \n• Defined procedures for collecting and securing evidence, including chain of custody \n• Availability of specialised services such as IT forensics \n• Procedure and templates for post-incident analysis and reporting \n• Procedure for substantiating claims against third parties, including the legal contractual basis for such claims \n• Procedure for preparing defences against claims by third parties, including aspects of appeal (regulatory decisions) \n• Defined link to post-incident Data Protection Officer (DPO) reporting",

    "Your enterprise's awareness process needs significant work. At a minimum, the enterprise-wide awareness process should cover: \n• Definition and description of  privacy and data protection regulations or norms requirements in day-to-day organisational processes, including examples of personal data processing \n• Campaign materials emphasising specific aspects of Data Protection and Privacy (DPP), personal data processing and  privacy and data protection related points to note \n• Program/project plans setting target dates for awareness measures \n• Third-party awareness materials and details on how to include third parties in awareness campaigns",

    "You have reported that staff in your enterprise are not adequately prepared to discharge their duties in regards to data protection and privacy matters. Data Protection and Privacy management, including the context of privacy and data protection, require a set of skills and qualifications that must be present in the enterprise or contracted through external services. The management of skills and education is an essential process to ensure that  privacy and data protection regulations or norms and their consequences are fully understood. The skills and education process should include, but not be limited to: \n• Definition of skills, levels and internal requirements for Data Protection and Privacy (DPP) related tasks and positions \n• Mapping of skills to roles and organisational functions (matrix) \n• Identification of suitable qualification levels and formal qualifications or certifications, as needed for each part of the matrix \n• Education paths for different roles and organisational functions in Data Protection and Privacy (DPP) \n• Gathering appropriate educational sources, materials and opportunities for guided self-study.",

    "Your enterprise is lacking an effective training process. Training is an important component of overall awareness, providing ongoing learning opportunities and reinforcing the key messages around Data Protection and Privacy (DPP) and privacy and data protection regulations or norms. At a minimum, the training process should cover: \n• Defined and validated basic  privacy and data protection regulations training, preferably mandatory for all members of the enterprise \n• Training concept based on the skills and education matrix \n• Training plan, typically on an annual basis, including internal and external training opportunities \n• Preparation of training materials, guided study and self-study \n• Preparatory training aids for higher qualifications in Data Protection and Privacy (DPP) and  privacy and data protection, including certification exam preparation, etc. \n• Defined external training sources and providers for specific purposes, e.g., legal or Data Protection Officer (DPO) training.",

    "Your enterprise does not have a well-established DPO function. At a minimum, the process of maintaining and running the DPO should cover the following: \n• Organisational structure and positioning of the DPO function, including the \n• DPO office and its points of contact in other parts of the enterprise \n• Design of administrative tasks and processes for the DPO function \n• Design of regular work program in an annual cycle \n• Human resource planning, skills and education needs.",

    "Your enterprise does not have a well-established DPO function. At a minimum, the process of maintaining and running the DPO should cover the following: \n• Organisational structure and positioning of the DPO function, including the \n• DPO office and its points of contact in other parts of the enterprise \n• Design of administrative tasks and processes for the DPO function \n• Design of regular work program in an annual cycle \n• Human resource planning, skills and education needs.",

    "There needs to be more concentration on building the DPO function into all parts of the enterprise so that there is full representation across the organisation. The management process for organiszational interfaces should cover at least: \n• Documentation of regular, formal contacts throughout the enterprise \n• DPO participation in standing committees and other formal institutional meetings \n• Regular communications between the DPO function and other organisational units, including minutes and other reports \n• Documented process steps requiring DPO involvement, including consultation and information (RACI).",

    "Formal internal and external reporting is an important part of the DPO function. Your enterprise has major issues that must be addressed in this area. At a minimum, the reporting management process should cover: \n• Reporting schedules for internal and external reporting to and by the DPO function \n• Reporting schedules for supervisory authority reporting \n• Procedures specifying report templates, formal content, frequency and distribution as well as Confidentiality, Integrity and Availability (CIA) ratings for reports \n• Tracking procedure for reporting, covering all reporting schedules.",

    "Your enterprise is not positioned to manage privacy and data protection regulations or norms conformance and related requirements that are contracted through external services. The process for managing external services should address, at a minimum: \n• Purpose and substance of external services, including a processing agreement \n• Defined and agreed protection level for the services rendered, specifying confidentiality, integrity and availability \n• Supplier risk analysis, including in-depth checks and due diligence where appropriate \n• Information security analysis \n• Right to audit, analysis of review results and tracking of remedial action \n• Human resource background checking where appropriate and legally permitted.",

    "Your enterprise's data acquisition controls are seriously lacking. At a minimum, the process for managing such controls should address: \n• Identification of organisational processes that may intentionally or incidentally acquire personal data \n• Documentation of inbound data flows and data interfaces (i.e., written, web, other) \n• Identification of data origin where possible (i.e., direct from data subject, controller, processor, other supply chain actors, etc.) \n• Documentation of related controls in the internal controls register.",

    "Your enterprise's processing controls are seriously lacking. The process of maintaining such controls should cover: \n• Identification of process steps, inputs and outputs that are to be controlled \n• Identification of handover points to third parties, e.g., processors or authorities \n• Definition of control objectives and control types (e.g., preventive, detective, corrective) \n• Documentation of related controls in the internal controls register.",

    "Your enterprise's storage controls are seriously lacking. The process of maintaining such controls should cover at least: \n• Identification of storage types and locations for personal data, i.e., storage map \n• Analysis of storage instances within the overall IT architecture \n• Identification of external storage instances, e.g., third party, virtualised, cloud \n• Identification and mapping of handover points between core processes (data in flow) and storage (data at rest) \n• Documentation of related controls in the internal controls register.",

    "Your enterprises deletion controls are seriously lacking. The process for maintaining deletion controls should cover at least: \n• Identification of deletion points within the overall system \n• Mapping of controls prior to deletion \n• Maintaining a deletion log \n• Mapping of controls after deletion \n• Verification of removal from the personal data register \n• Documentation of related controls in the internal controls register.",

    "Your enterprise's monitoring controls are seriously lacking. The process for maintaining monitoring controls should cover at least: \n• Mapping of personal data processing to overall monitoring, including tools \n• Identification of monitoring needs across the process register \n• Mapping of reporting needs and application to monitoring processes \n• Recurring review of monitoring density and extent  \n• Documentation of related controls in the internal controls register.",

    "Your enterprise is not prepared to manage independent reviews. Managing independent reviews further requires planning steps similar to standard reviews, including notification, fieldwork, analysis and reporting. Data Protection and Privacy (DPP) practitioners and enterprises may benefit from leveraging standardised audit and review processes for Data Protection and Privacy (DPP) reviews. They should further link to the minimum structure and content of Data Protection Officer (DPO) reporting as set down in established privacy and data protection regulations or norms.",


  ];
}


function returnNA_P() {
  return ["É necessário grande esforço nesta área. Quando apropriado, a estrutura de governança deve fazer referência a políticas e procedimentos existentes vinculados ao processamento de dados pessoais (por exemplo, a política de segurança da informação ou a política de gerenciamento de identidade e acesso). Da mesma forma, os conceitos e disposições organizacionais e técnicos devem ser referenciados para garantir a consistência (por exemplo, quaisquer esquemas de classificação de dados existentes ou a determinação dos níveis de proteção de ativos de informação).",

    "São necessárias melhorias significativas no registro de processamento da sua empresa. Os elementos de governança em torno de um registro de processamento incluem, entre outros: Ativos de informação usados ​​(do registro de dados pessoais) Objetivo (s) de processamento Processos de negócios ou outros processos organizacionais que utilizam os ativos Processamento do ciclo de vida da aquisição inicial de dados à exclusão de dados (planejado ou ad hoc) O processo de governança em torno do registro de processamento deve definir ainda mais uma função ou função responsável por manter o registro, bem como a acessibilidade do registro para análises internas e externas. Outras disposições de governança podem incluir o escopo e o procedimento para apresentar o registro como evidência, interna e externamente. Em situações em que o processamento complexo de grandes quantidades de dados pessoais ocorra, o registro deve ser regido por uma política ou procedimento operacional chave apropriado. ",

    "Sua empresa precisa prestar muita atenção às melhorias nessa área. Uma empresa deve estabelecer, manter, monitorar e adaptar continuamente regras corporativas vinculativas que reflitam adequada e abrangente a estrutura de governança interna e externa. Atividades em conjunto com políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. incluem, entre outros: Definição, descrição e aprovação de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. pela alta administração Comunicação de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto em um grupo de empresas ou empresas. em toda a empresa Validação e atualização anual ou ad hoc das políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. Integração de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto em um grupo de empresas ou empresas. em relações contratuais de terceiros Monitoramento de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas.conformidade interna e externa ",

    "Faltam regras de consentimento da sua empresa. No mínimo, as disposições de governança em torno do consentimento devem abranger: \n• Transparência e permitir informações aos titulares dos dados \n• Tipos de consentimento e requisitos relacionados \n• Retirada do consentimento dos titulares dos dados \n• Processos, controles e verificações específicas para crianças consentimento, incluindo verificação apropriada da idade e / ou autoridade dos pais, bem como consentimento dos pais \n• Canais de comunicação, simplicidade de linguagem e acessibilidade de interfaces baseadas em consentimento ",

    "Sua empresa não está preparada para processar solicitações de titulares de dados. No mínimo, as disposições de governança em relação às solicitações dos titulares de dados devem abranger: \n• Receber e documentar solicitações dos titulares de dados \n• Validação de solicitações relacionadas a objetivos, legal e técnica \n• Resposta formal, incluindo canais e formatos de comunicação \n• Interfaces para processos internos e da cadeia de suprimentos \n• Interface para registro de dados pessoais e registro de processamento \n• Revisão independente de solicitações pela função Data Protection Officer ",

    "Sua empresa não está equipada para atender às reclamações dos titulares de dados. No mínimo, as disposições de governança em torno das reclamações dos titulares dos dados devem abranger: \n• Recebimento e documentação inicial, incluindo qualquer resposta formal às autoridades de supervisão \n• Análise de reclamações, incluindo interfaces organizacionais, legais e técnicas dentro da empresa \n• Definição e implementação de reparação, quando aplicável \n• Identificação de possíveis lacunas ou deficiências que levem à reclamação e oportunidades de melhoria ",


    "É crucial para sua empresa estabelecer um processo para garantir a supervisão objetiva. As atividades em conjunto com a supervisão imparcial incluem, mas não se limitam a: \n• Funções organizacionais que executam e garantem supervisão imparcial \n• Funções e responsabilidades (RACI), incluindo imparcialidade demonstrada \n• Objetivos, escopo e extensão das atividades de supervisão \n• Frequência baseada em risco das atividades de supervisão Procedimentos e orientações para o planejamento, implantação e elaboração de relatórios ",

    "É necessário um grande esforço nesta área. No mínimo, as seguintes partes do ciclo devem ser definidas e implementadas: • Criação ou aquisição de dados, incluindo a cadeia de processamento de dados pessoais (suprimento) \n• Classificação de ativos de informações, incluindo níveis de proteção e atribuição a categorias especiais \n• Inclusão no registro de dados pessoais e no processamento e remoção de registros \n• Processamento real e controles relacionados \n• Armazenamento temporário e permanente, incluindo armazenamento virtualizado e em nuvem Exclusão de arquivamento e agregação, ambos planejados (final de vida ou final de finalidade) e ad hoc (solicitação de apagamento etc.)",

    "São necessárias melhorias significativas no processo da sua empresa para identificar e documentar dados pessoais. O processo de identificação deve, no mínimo, abordar os seguintes aspectos: \n• Definição de critérios de acordo com seus critérios de privacidade e proteção de dados • Procedimento para analisar conjuntos de dados existentes, possivelmente em combinação com a análise dos níveis de proteção de segurança (CIA) \n• Procedimento de entrega para registro de dados pessoais \n• Análise de inferência potencial (identificação indireta de pessoas físicas) de conjuntos de dados separados e / ou dispersos \n• Procedimento de integração para novos dados \n• Procedimentos e controles para terceiros partidos ",


    "Sua empresa não está equipada para manter a classificação dos dados. No mínimo, a classificação de dados pessoais deve abordar: \n• Atributo geral de \"pessoal\" de acordo com seus critérios de privacidade e proteção de dados; relevância pessoal mais ampla como PII, se necessário \n• Classificação específica relacionada a categorias e finalidades especiais, incluindo limitações e requisitos adicionais de segurança \n• Classificação em termos de não rejeição de transações envolvendo dados pessoais \n• Outros aspectos, como sigilo profissional aplicável ou critérios de acesso restrito ",

    "O registro de dados pessoais da sua empresa precisa de melhorias significativas. No mínimo, o processo de registro de dados pessoais deve abordar: \n• Tipo de dados e agregação (se houver) em ativos de informação \n• Links relevantes entre conjuntos de dados que formam ativos de informação sob seus critérios de privacidade e proteção de dados \n• Tipos e formatos de dados, incluindo dados não mantidos em formatos eletrônicos (por exemplo, papel, microficha) \n• Localização e instanciação de dados, incluindo várias cópias, imagens virtualizadas e em nuvem, etc. \n• Informações sobre o ciclo de vida e o tempo de vida, incluindo planejado arquivamento e exclusão \n• Etapas de processamento vinculadas, unidades organizacionais e finalidades de processamento, detalhando claramente quando, por que, onde e por quem do processamento de dados pessoais ",


    "Sua empresa não está equipada para gerenciar dados de categorias especiais. Isso requer um processo robusto que identifica, controla e documenta qualquer processamento de dados pertencentes a uma ou mais categorias especiais, abrangendo no mínimo, mas não limitado a: \n• Mapeamento de ativos de informações identificadas para categorias especiais, de acordo com seus critérios para privacidade e proteção de dados \n• Documentação de circunstâncias justificativas (conforme seus critérios de privacidade e proteção de dados) para cada ativo de informação \n• Documentação de qualquer classificação nova ou alterada desses ativos de informação \n• Documentação de todas as comunicações com os titulares de dados ou autoridades de supervisão relacionadas ao ativo de informação \n• Documentação do consentimento relacionado ao ativo e retirada do consentimento \n• Links verificados para o registro de dados pessoais e o registro de processamento, incluindo evidências de processamento restrito ao (s) objetivo (s) definido (s) ",

    "Sua empresa não está preparada para responder às demandas de apagamento. O processo deve, no mínimo, abordar os seguintes aspectos: \n• Recepção, confirmação e análise de solicitações de apagamento por titulares de dados ou autoridades competentes \n• Validação e internalização de solicitações de apagamento transferidas por terceiros \n• Interfaces definidas para outros processos, isto é, registro de dados pessoais e \n• registro de processamento, classificação e ciclo de vida dos dados \n• Aprovações e procedimentos de verificação independente para apagamento \n• Procedimento de confirmação e comunicação de apagamento (para pessoas ou autoridades de dados) ",


    "Sua empresa deve realizar uma avaliação de risco completa. Os resultados da avaliação de riscos devem incluir, no mínimo: \n• Registro abrangente de eventos e ameaças, levando aos seus critérios para categorias de risco de privacidade e proteção de dados \n• Estimativas de frequência e premissas de precaução \n• Agregação e agrupamento de eventos principais com os mesmos riscos que se materializam \n• Classificação de risco, geralmente de acordo com o esquema de classificação de risco organizacional abrangente ",

    "Sua empresa deve realizar uma avaliação completa do impacto na proteção de dados. A DPIA deve levar em conta os controles existentes e as medidas de mitigação de risco, e deve identificar o impacto potencial resultante do risco residual que não foi ou não pode ser totalmente mitigado.",

    "Sua empresa precisa fazer grandes melhorias para gerenciar melhor o tratamento de riscos. O processo de tratamento de riscos deve, no mínimo, abranger o seguinte: \n• Evitar ou eliminar riscos, incluindo alterações nas disposições de processamento ou descontinuar o processamento (reestruturar ou sair) \n• Eliminação de riscos por meio de controles ou salvaguardas adicionais \n• Riscos transferência, incluindo a reestruturação da cadeia de suprimento de dados pessoais \n• Redução de riscos por meio de controles adicionais ou medidas de mitigação • Tolerância ao risco, com base na frequência e impacto estimados ",

    "Sua empresa precisa estabelecer um processo de validação de risco. No mínimo, esse processo deve abordar: \n• Confirmação (ou alteração) dos resultados da avaliação de riscos, incluindo estimativas de frequência e o universo de eventos / ameaças \n• Revisão da eficácia das medidas e atividades de tratamento, com base em um período razoável de observação \n• Revisão de quaisquer incidentes ou violações que possam ter ocorrido desde a última validação \n• Análise de quaisquer alterações na estrutura e nos termos de referência, ou seja, em relação a quaisquer eventos legislativos ou regulamentares, políticos ou financeiros ",


    "Sua empresa precisa de melhorias nesta área. O anonimato e a pseudonimização devem abranger, mas não estão limitados a: \n• Identificação de conjuntos de dados pessoais a serem anonimizados / pseudonimizados \n• Definição de técnicas em todos os níveis técnicos, por exemplo, arquivo, registro de banco de dados, \n• sistemas de arquivo não eletrônico \n• Documentação e registro real de anonimização / pseudonimização \n• Link definido para registro de dados pessoais e registro de processamento \n• Aplicação recursiva do princípio da necessidade de conhecimento em toda a cadeia de suprimentos; integração da necessidade real de conhecer o gerenciamento de identidades e acessos",

    "A estratégia de criptografia e seus componentes devem se basear em risco e eficiência, garantindo que seus critérios para riscos de privacidade e proteção de dados sejam totalmente compreendidos e internalizados em qualquer decisão. Sua empresa precisa de melhorias sérias nesta área. No mínimo, o processo de criptografia deve abordar: \n• Conjunto definitivo de dados pessoais e ativos de informações a serem criptografados, com base nos níveis de proteção atribuídos e nos seus critérios de privacidade e risco e impacto na proteção de dados \n• Definição de técnicas de criptografia e metas, por exemplo, dados individuais, elementos de banco de dados, bancos de dados inteiros, transações, etc. \n• Links para técnicas e ferramentas de criptografia reconhecidas ou aprovadas, já em uso na empresa \n• Escopo, planejamento e etapas de implementação para criptografia adicional necessária para dados pessoais",


    "Sua empresa exige grandes aprimoramentos para gerenciar os níveis de proteção. O processo em torno dos níveis de proteção de dados pessoais fornece uma interface definida (nos dois sentidos) entre a segurança geral das informações e a segurança dos dados pessoais. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada dos dados pessoais nas análises do nível de proteção. ",


    "Sua empresa não possui um processo maduro para gerenciar a resiliência. No mínimo, o processo de resiliência deve cobrir: \n• Criticidade de dados pessoais, geralmente expressa como uma combinação de requisitos de integridade e disponibilidade \n• Criticidade de processamento em função do tempo, isto é, período máximo tolerável de indisponibilidade, perda máxima tolerável de dados \n• Planos de recuperação para conjuntos de dados pessoais \n• Links definidos para planos gerais de continuidade de negócios e serviços de TI \n• Conceitos de backup e restauração de conjuntos de dados pessoais, vinculados a planos e procedimentos gerais de backup e restauração \n• Instância múltipla de conjuntos de dados pessoais que exigem alta disponibilidade, ou seja, processamento totalmente resiliente ",

    "Sua empresa não está gerenciando efetivamente o acesso aos dados pessoais. As restrições e limitações de acesso resultantes de requisitos de processamento de dados pessoais devem ser documentadas e alimentadas no processo geral do IAM. O processo de gerenciamento de acesso a dados pessoais, portanto, fornece uma interface (nos dois sentidos) para o IAM geral. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada de dados pessoais no gerenciamento de acesso. ",

    "O processo da sua empresa para gerenciar testes e avaliação da segurança de dados pessoais precisa de uma visão séria. No mínimo, o processo deve abordar: \n• Tipos de teste e avaliação, por exemplo, teste conceitual, verificação de vulnerabilidade e teste de penetração \n• Frequência do teste \n• Evidência de melhoria contínua, ou seja, testes e avaliações progressivamente mais exigentes com o tempo \n• Teste de registro e proteção de evidências \n• Análise de pontos fracos e documentação de oportunidades de melhoria ",

    "O processo da sua empresa para gerenciar controladores e processadores precisa de muita atenção. O processo deve abranger pelo menos: \n• Identificação de controladores primários e conjuntos, incluindo objetivos individuais ou coletivos para o processamento de dados pessoais \n• Identificação de processadores, incluindo o escopo definido e a extensão do processamento em nome de um ou mais controladores \n• Links para o registro de dados pessoais, refletindo os conjuntos de dados e a maneira como eles são tratados na cadeia de suprimentos (dados em fluxo; dados em repouso) \n• Links para o registro de processamento, refletindo os processos ou etapas do processo executados por cada ator da cadeia de suprimentos \n• Documentação dos acordos de gerenciamento e controle de fornecedores (processadores), geralmente incorporados ao gerenciamento geral de fornecedores de uma empresa ",


    "Em cadeias de suprimentos complexas, o processo de gerenciamento de subprocessamento é um elemento essencial para garantir seus critérios de privacidade e conformidade de proteção de dados em toda a cadeia de suprimentos. Sua empresa precisa de grandes melhorias nessa área. O processo de gerenciamento de subprocessos deve cobrir, no mínimo: \n• Procedimento formal de solicitação aos processadores primários; divulgação de qualquer terceirização adicional \n• Documentação e registro de subprocessamento, incluindo escopo, extensão e objetivo (s) \n• Evidência de seus critérios de conformidade com a privacidade e proteção de dados, incluindo processos, controles, conceitos e resultados de revisão \n• Auditoria relatórios e outras garantias independentes, se disponíveis \n• Processamento de contratos entre processadores primários e subprocessadores ",

    "Os contratos de processamento da sua empresa precisam de um trabalho sério. No mínimo, o processo em torno desses acordos deve abranger: \n• Definição, aprovação e implementação de acordos padronizados, incluindo modelos \n• Monitoramento regular do cumprimento \n• Planejamento e execução de revisões, principalmente sob o direito padrão de auditoria \n• Recebimento, análise e validação de evidências de terceiros para processamento conforme, por exemplo, relatórios de certificação e atestado \n• Revisão e atualização regulares de contratos, termos e condições de processamento, de acordo com a atividade legislativa e regulamentar \n• Planejamento de término e saída para relacionamentos contratuais individuais ",

    "Sua empresa tem problemas sérios que precisam ser resolvidos para gerenciar o impacto na cadeia de suprimentos. Em uma cadeia de suprimentos com vários atores, os impactos resultantes de seus critérios para riscos de privacidade e proteção de dados podem se materializar a qualquer momento e a qualquer momento. Portanto, profissionais e empresas de DPP devem aplicar sua própria abordagem de DPIA a todas as partes da cadeia de suprimentos e documentar o feedback recebido de cada uma das partes. Isso inclui relatórios padronizados, bem como revisões ad hoc ou verificações de plausibilidade. O impacto geral deve ser agregado, com base no registro de processamento e no fluxo de dados entre os vários participantes da cadeia de suprimentos. Deve-se tomar cuidado para entender como os impactos em um local podem agravar os impactos em outras partes da cadeia de suprimentos. ",

    "Quando o processamento de dados pessoais é realizado em uma cadeia de suprimentos, os controles internos de um processador ou subprocessador devem ser tão eficazes quanto os da organização do controlador. Sua empresa deve fazer grandes melhorias no processo de controle da cadeia de suprimentos. No mínimo, o processo deve abranger o seguinte: \n• Obtenção e análise de documentação de controles internos de terceiros \n• Mapeamento para o sistema de controle interno (ICS) na organização do controlador \n• Procedimentos para teste de projeto (ToD), ou seja, técnicas padrão para avaliação de controles \n• Procedimentos para teste de eficácia (ToE), ou seja, amostragem e coleta de evidências que demonstram a eficácia dos controles de terceiros \n• Arranjos de monitoramento e revisão de logs, incluindo acessibilidade dos dados de log, na medida em que elas estão relacionadas ao processamento de dados pessoais \n• Direitos de auditoria pontuais ou contínuos, incluindo planejamento e implantação de auditoria ",

    "Sua empresa não está preparada para gerenciar a notificação em tempo hábil. No mínimo, o processo de notificação às autoridades de supervisão deve incluir: \n• Procedimento de coleta / investigação de informações, descrevendo a interação entre a função do Oficial de Proteção de Dados e outras partes da empresa e / ou serviços externos \n• Pacote de relatórios padronizado, incluindo o mínimo seus critérios para o conjunto de informações sobre privacidade e proteção de dados e modelos apropriados ",

    "Sua empresa não está preparada para notificar os titulares dos dados em caso de incidente ou violação. No mínimo, o processo de notificação dos titulares dos dados deve abranger: \n• Formato e modelos de relatório padronizados, adaptados e otimizados para vários canais de comunicação (indivíduo, grupo, público) \n• Mensagens principais predefinidas e aprovadas que expressam as ações da empresa (investigação, conseqüências, remediação, aprimoramento etc.) \n• Responsabilidades organizacionais em relação à formulação e transmissão de mensagens-chave, por exemplo, envolvimento do departamento de comunicações, aconselhamento jurídico, etc. \n• Recursos de comunicação ad hoc oferecidos aos titulares dos dados , por exemplo, linha de ajuda, número de telefone gratuito, site escuro etc. ",


    "O processo de gerenciamento de incidentes e crises da sua empresa precisa de melhorias sérias. Da perspectiva dos profissionais de DPP e das unidades organizacionais que inicialmente descobriram a violação, o processo deve cobrir pelo menos: \n• Descrição e documentação de fatos e números conhecidos, em um formato padronizado, quando apropriado \n• Link definido para o processo geral de escalação e alerta , geralmente definido pela função de gerenciamento de crises empresariais (BCM) \n• Cenário de dados pessoais genéricos predefinidos para continuidade dos negócios e gerenciamento de crises, semelhante a outros cenários especiais, como ataque cibernético, pandemia, etc. \n• Relacionamentos e canais de comunicação predefinidos com canais externos atores, ou seja, serviços externos, como especialistas em investigação ou forense; Protocolo de comunicações em andamento entre unidades organizacionais da linha e equipes de gerenciamento de incidentes / crises",

    "Sua empresa não está preparada para gerenciar evidências e reivindicações adequadamente. As violações de dados pessoais representam casos de não conformidade, mas também indicam que negligência interna e / ou externa ou atividade criminosa pode estar presente. O processo de evidência e reclamações deve, portanto, abranger, no mínimo: \n• Procedimentos definidos para coletar e proteger evidências, incluindo cadeia de custódia \n• Disponibilidade de serviços especializados, como forense de TI \n• Procedimento e modelos para análise pós-incidente e relatórios \n• Procedimento para fundamentar reivindicações contra terceiros, incluindo a base contratual legal para tais reivindicações \n• Procedimento para preparar defesas contra reivindicações de terceiros, incluindo aspectos de apelação (decisões regulatórias) \n• Link definido para publicar dados de incidentes Relatório do oficial de proteção",

    "O processo de conscientização da sua empresa precisa de um trabalho significativo. No mínimo, o processo de conscientização em toda a empresa deve abranger: \n• Definição e descrição de seus critérios para requisitos de privacidade e proteção de dados nos processos organizacionais diários, incluindo exemplos de processamento de dados pessoais \n• Materiais de campanha enfatizando aspectos específicos de DPP, processamento de dados pessoais e seus critérios para pontos relacionados à privacidade e à proteção de dados a serem observados \n• Planos de programas / projetos que definem datas-alvo para medidas de conscientização \n• Materiais de conscientização de terceiros e detalhes sobre como incluir terceiros em campanhas de conscientização ",

    "Você relatou que a equipe da sua empresa não está adequadamente preparada para cumprir suas obrigações com relação a questões de proteção de dados e privacidade. A proteção de dados e o gerenciamento de privacidade, incluindo o contexto de seus critérios de privacidade e proteção de dados, exigem um conjunto de habilidades e qualificações que devem estar presentes na empresa ou contratadas por meio de serviços externos. O gerenciamento de habilidades e educação é um processo essencial para garantir que seus critérios de privacidade e proteção de dados e suas conseqüências sejam totalmente compreendidos. O processo de habilidades e educação deve incluir, mas não se limitar a: \n• Definição de habilidades, níveis e requisitos internos para tarefas e posições relacionadas ao DPP \n• Mapeamento de habilidades para cargos e funções organizacionais (matriz) \n• Identificação de níveis de qualificação adequados e qualificações ou certificações formais, conforme necessário para cada parte da matriz \n• Caminhos de educação para diferentes funções e funções organizacionais no DPP \n• Reunir fontes, materiais e oportunidades educacionais apropriadas para auto-estudo guiado ",


    "Falta à sua empresa um processo de treinamento eficaz. O treinamento é um componente importante da conscientização geral, oferecendo oportunidades contínuas de aprendizado e reforçando as principais mensagens sobre o DPP e seus critérios de privacidade e proteção de dados. No mínimo, o processo de treinamento deve abranger: \n• Definidos e validados seus critérios básicos para treinamento em privacidade e proteção de dados, preferencialmente obrigatórios para todos os membros da empresa \n• Conceito de treinamento baseado na matriz de habilidades e educação \n• Treinamento plano, normalmente anualmente, incluindo oportunidades de treinamento interno e externo \n• Preparação de materiais de treinamento para estudo guiado e auto-estudo \n• Auxílios de treinamento preparatório para qualificações mais altas no DPP e seus critérios de privacidade e proteção de dados, incluindo preparação para exames de certificação, etc. \n• Defina fontes e provedores externos de treinamento para fins específicos, por exemplo, treinamento jurídico ou de proteção de dados ",

    "Sua empresa não possui uma função bem estabelecida de responsável pela proteção de dados. No mínimo, o processo de manutenção e execução do Responsável pela proteção de dados deve abranger o seguinte: \n• Estrutura organizacional e posicionamento da função do Responsável pela proteção de dados, incluindo o escritório do Responsável pela proteção de dados e seus pontos de contato em outras partes da empresa \n• Projeto de tarefas e processos administrativos para a função de Oficial de Proteção de Dados \n• Projeto de programa de trabalho regular em um ciclo anual \n• Planejamento de recursos humanos, habilidades e necessidades educacionais ",

    "Sua empresa não possui uma função bem estabelecida de responsável pela proteção de dados. No mínimo, o processo de manutenção e execução do Responsável pela proteção de dados deve abranger o seguinte: \n• Estrutura organizacional e posicionamento da função do Responsável pela proteção de dados, incluindo o escritório do Responsável pela proteção de dados e seus pontos de contato em outras partes da empresa \n• Projeto de tarefas e processos administrativos para a função de Oficial de Proteção de Dados \n• Projeto de programa de trabalho regular em um ciclo anual \n• Planejamento de recursos humanos, habilidades e necessidades educacionais ",


    "A função do Data Protection Officer deve estar melhor representada em toda a empresa. O processo de gerenciamento de interfaces organizacionais deve abranger pelo menos:\n • Documentação de contatos regulares e formais em toda a empresa \n• Participação do Diretor de proteção de dados em comitês permanentes e outras reuniões institucionais formais \n• Comunicações regulares entre a função do Diretor de proteção de dados outras unidades organizacionais, incluindo atas e outros relatórios \n• Etapas do processo documentadas que exigem o envolvimento do Data Protection Officer, incluindo consulta e informação (RACI) ",

    "Os relatórios internos e externos formais são uma parte importante da função de Responsável pela proteção de dados. Sua empresa possui grandes problemas que devem ser abordados nesta área. No mínimo, o processo de gerenciamento de relatórios deve abranger: \n• Agendamentos de relatórios para relatórios internos e externos para e pela função Responsável pela Proteção de Dados \n• Agendamentos de relatórios para relatórios da autoridade de supervisão \n• Procedimentos que especificam modelos de relatórios, conteúdo formal, frequência e distribuição, bem como classificações da CIA para relatórios \n• Procedimento de rastreamento de relatórios, abrangendo todos os cronogramas de relatórios ",

    "Sua empresa não está posicionada para gerenciar seus critérios de conformidade de privacidade e proteção de dados e requisitos relacionados que são contratados por meio de serviços externos. O processo de gerenciamento de serviços externos deve abordar, no mínimo: \n• Finalidade e substância dos serviços externos, incluindo um contrato de processamento \n• Nível de proteção definido e acordado para os serviços prestados, especificando confidencialidade, integridade e disponibilidade \n• Fornecedor análise de risco, incluindo verificações aprofundadas e due diligence, quando apropriado \n• Análise de segurança da informação \n• Direito de auditar, analisar resultados de revisão e rastrear ações corretivas \n• Verificação de antecedentes de recursos humanos, quando apropriado e permitido legalmente ",

    "Os controles de aquisição de dados da sua empresa estão seriamente ausentes. No mínimo, o processo para gerenciar esses controles deve abordar: \n• Identificação de processos organizacionais que podem intencionalmente ou acidentalmente adquirir dados pessoais \n• Documentação de fluxos de dados de entrada e interfaces de dados (por exemplo, escritos, web, outros) \n• Identificação da origem dos dados sempre que possível (ou seja, diretamente do titular dos dados, controlador, processador, outros atores da cadeia de suprimentos, etc.) \n• Documentação dos controles relacionados no registro de controles internos ",

    "Os controles de processamento da sua empresa estão seriamente ausentes. O processo de manutenção de tais controles deve abranger: \n• Identificação das etapas do processo, entradas e saídas que devem ser controladas \n• Identificação dos pontos de transferência para terceiros, por exemplo, processadores ou autoridades \n• Definição dos objetivos e controle do controle tipos (por exemplo, preventivo, detetive, corretivo) \n• Documentação dos controles relacionados no registro de controles internos ",

    "Os controles de armazenamento da sua empresa estão seriamente ausentes. O processo de manutenção de tais controles deve abranger pelo menos: \n• Identificação de tipos e locais de armazenamento de dados pessoais, como mapa de armazenamento v• Análise de instâncias de armazenamento na arquitetura geral de TI \n• Identificação de instâncias de armazenamento externo, por exemplo , terceirizado, virtualizado, nuvem \n• Identificação e mapeamento de pontos de transferência entre processos principais (dados em fluxo) e armazenamento (dados em repouso) \n• Documentação de controles relacionados no registro de controles internos ",

    "Os controles de exclusão da sua empresa estão seriamente ausentes. O processo para manter controles de exclusão deve abranger pelo menos: \n• Identificação de pontos de exclusão no sistema geral \n• Mapeamento de controles antes da exclusão \n• Manutenção de um log de exclusão \n• Mapeamento de controles após exclusão \n• Verificação remoção do registro de dados pessoais \n• Documentação de controles relacionados no registro de controles internos ",

    "Os controles de monitoramento da sua empresa estão seriamente ausentes. O processo para manter os controles de monitoramento deve abranger pelo menos: \n• Mapeamento do processamento de dados pessoais para o monitoramento geral, incluindo ferramentas \n• Identificação das necessidades de monitoramento no registro do processo \n• Mapeamento das necessidades de relatórios e aplicação nos processos de monitoramento \n• Revisão recorrente da densidade e extensão do monitoramento \n• Documentação dos controles relacionados no registro de controles internos ",

    "Sua empresa não está preparada para gerenciar avaliações independentes. O gerenciamento de revisões independentes requer etapas de planejamento semelhantes às revisões padrão, incluindo notificação, trabalho de campo, análise e relatório. Os profissionais e empresas do DPP podem se beneficiar da alavancagem de processos padronizados de auditoria e revisão para análises do DPP. Eles devem ainda vincular-se à estrutura e ao conteúdo mínimos dos relatórios do Data Protection Officer, conforme estabelecido em seus critérios de privacidade e proteção de dados. ",


  ];
}


function returnPA_E() {
  console.error("In returnPA_E");
  return ["Considerable more work is required in this area. It is imperative that the governance framework references existing policies and procedures that are linked to personal data processing (for example, the information security policy or the identity and access management policy). Likewise, organisational and technical concepts and arrangements should be referenced to ensure consistency (for instance, any existing data classification schemes or the determination of information asset protection levels).",

    "Improvements are needed to your enterprise's processing register. Governance elements around a processing register include, but are not limited to: \n• Information assets used (from personal data register) \n• Purpose(s) of processing \n• Business processes or other organisational processes utilizing the assets \n• Processing life cycle from initial data acquisition to data deletion (planned or ad hoc) \n• The governing process around the processing register should further define a role or function responsible for maintaining the register, as well as accessibility of the register to internal and external reviews. Further governance provisions might include the scope and procedure for presenting the register as evidence, both internally and externally. In situations where complex processing of large amounts of personal data takes place, the register should be governed by a policy or appropriate key operating procedure.",

    "Your enterprise needs to give further attention to this area. An enterprise should establish, maintain, continuously monitor and adapt binding corporate rules that adequately and comprehensively reflect the internal and external governance framework. Activities in conjunction with BCRs include, but are not limited to: \n• Definition, description and approval of BCRs by senior management \n• Communication of BCRs on an enterprise-wide basis \n• Annual or ad hoc validation and updating of BCRs \n• Integration of BCRs in third-party contractual relationships \n• Monitoring of BCR conformance internally and externally",

    "Your enterprise needs to make enhancements to your rules for consent. At a minimum, governance provisions around consent should cover: \n• Transparency and enabling information to data subjects \n• Types of consent and related requirements \n• Withdrawal of consent by data subjects \n• Specific processes, controls and verification for child consent, including appropriate verification of age and/or parental authority as well as parental consent \n• Communication channels, simplicity of language and accessibility of consent-based interfaces",

    "Your enterprise is only minimally equipped to process data subject requests. At a minimum, governance provisions around data subjects requests should cover: \n• Receiving and documenting data subject requests \n• Purpose-related, legal and technical validation of requests \n• Formal response, including communications channels and formats \n• Interfaces to internal and supply chain processes \n• Interface to personal data register and processing register \n• Independent review of requests by the DPO function",

    "Your enterprise needs to be better equipped to address data subjects' complaints. At a minimum, governance provisions around data subjects’ complaints should cover: \n• Receipt and initial documentation, including any formal response to supervisory authorities \n• Complaint analysis, including organisational, legal and technical interfaces within the enterprise \n• Definition and implementation of remediation where applicable \n• Identification of potential gaps or weaknesses leading to the complaint and opportunities for improvement.",

    "Your enterprise's governance process to ensure objective oversight needs work. Activities in conjunction with impartial oversight include, but are not limited to: \n• Organisational roles performing and ensuring impartial oversight \n• Roles and responsibilities (RACI), including demonstrated impartiality \n• Objectives, scope and extent of oversight activities \n• Risk-based frequency of oversight activities \n• Procedures and guidance for planning, deploying and reporting.",

    "Additional effort is needed in this area. At a minimum, the following parts of the cycle should be defined and implemented: \n• Data creation or acquisition, including the personal data processing (supply) chain \n• Information asset classification, including protection levels and assignment to special categories \n• Inclusion in the personal data register and the processing register and removal from registers \n• Actual processing and related controls \n• Temporary and permanent storage, including virtualised and cloud storage \n• Archiving and aggregation \n• Deletion, both planned (end of life or end of purpose) and ad hoc (erasure request, etc.)",

    "Improvements are needed to your enterprise's process to identify and document personal data. The identification process should, at a minimum, address the following aspects: \n• Definition of criteria in accordance with established privacy and data protection regulations or norms \n• Procedure for analysing existing data sets, possibly in combination with the analysis of security protection levels Confidentiality, Integrity and Availability (CIA) \n• Handover procedure to personal data register \n• Analysis of potential inference (indirect identification of natural persons) from separate and/or dispersed data sets \n• Onboarding procedure for new data \n• Procedures and controls for third parties.",

    "Your enterprise needs to be better equipped to Maintain Data Classification. At a minimum, personal data classification should address: \n• General attribute of “personal” in accordance with established privacy and data protection regulations or norms; wider personal relevance as Personally Identifiable Information (PII) if needed \n• Specific classification relating to special categories and purposes, including limitations and additional security requirements \n• Classification in terms of nonrepudiation of transactions involving personal data \n• Other aspects, such as applicable professional secrecy or restricted access criteria",

    "Your enterprise's personal data register needs improvement. At a minimum, the personal data register process should address: \n• Type of data and aggregation (if any) into information assets \n• Relevant links between data sets that form information assets under established privacy and data protection regulations or norms \n• Data types and formats, including data not held in electronic formats (e.g., paper, microfiche) \n• Data location and instantiation, including multiple copies, virtualised and cloud images, etc. \n• Life cycle and life span information, including planned archiving and deletion \n• Linked processing steps, organisational units and processing purposes, clearly detailing the when, why, where and by whom of personal data processing. ",

    "Your enterprise is only minimally equipped to manage special categories data. This requires a robust process that identifies, controls and documents any processing of data belonging to one or more special categories, covering at a minimum, but not limited to: \n• Mapping of identified information assets to special categories in accordance with established privacy and data protection regulations or norms \n• Documentation of justifying circumstances (as per established privacy and data protection regulations or norms) for each information asset \n• Documentation of any new or changed classification of such information assets \n• Documentation of all communications with data subjects or supervisory authorities as relating to the information asset \n• Documentation of asset-related consent and withdrawal of consent \n• Verified links to personal data register and processing register, including evidence of processing that is restricted to the defined purpose(s).",

    "Your enterprise may not be prepared to adequately respond to demands for erasure. The process should, at a minimum, address the following aspects: \n• Receipt, confirmation and analysis of erasure requests by data subjects or competent authorities \n• Validation and internalization of erasure requests transferred by third parties \n• Defined interfaces to other processes, i.e., personal data register and processing register, data classification and data life cycle \n• Approvals and independent-verification procedures around erasure \n• Erasure confirmation and communications procedure (to data subjects or authorities).",

    "Your organisation has begun to conduct a risk evaluation - it is of paramount importance that this be completed. The results of the risk evaluation should include, at a minimum: \n• Comprehensive register of events and threats leading to privacy and data protection risk categories \n• Frequency estimates and precautionary assumptions \n• Aggregation and clustering of events leading to the same risks materialising \n• Risk classification, usually in accordance with the overarching organisational risk classification scheme.",

    "Your enterprise needs to make significant more progress on completing a thorough data protection impact assessment. The Data Protection Impact Assessment (DPIA) must take into account existing controls and risk mitigation measures, and aim at identifying the potential impact resulting from the residual risk that has not been or cannot be fully mitigated.",

    "Your enterprise should make improvements to better manage risk treatment. The risk treatment process should, at a minimum, cover the following: \n• Risk avoidance or elimination, including changes to processing arrangements or discontinuation of processing (restructure or exit) \n• Risk elimination through additional controls or safeguards \n• Risk transfer, including restructuring of the personal data supply chain \n• Risk reduction through additional controls or mitigation measures \n• Risk tolerance, based on the estimated frequency and impact.",

    "Your enterprise should review your risk validation process for deficiencies. At a minimum, the risk validation process should address: \n• Confirmation (or change) of risk evaluation results, including frequency estimates and the event/threat universe \n• Review of effectiveness of treatment measures and activities, based on a reasonable period of observation \n• Review of any incidents or breaches that may have occurred since the last validation \n• Analysis of any changes to the framework and terms of reference, i.e., in respect of any legislative or regulatory, political or financial events.",

    "Your enterprise could use some improvement in this area. Anonymisation and pseudonymisation should cover, but are not limited to: \n• Identification of personal data sets to be anonymized/pseudonymized \n• Definition of techniques at all technical levels, e.g., file, database record, non electronic filing systems \n• Documentation and log of actual anonymisation/pseudonymisation \n• Defined link to personal data register and processing register \n• Recursive application of the need-to-know principle across the supply chain; integration of the actual need to know with identity and access management.",

    "The encryption strategy and its components should be based on risk and efficiency, making sure that  privacy and data protection risks are fully understood and internalised in any decision. Your enterprise should make improvements in this area. At a minimum, the encryption process should address: \n• Definitive set of personal data and information assets to be encrypted, based on the assigned protection levels and the privacy and data protection risks and impacts \n• Definition of encryption techniques and targets, e.g., individual data, database elements, whole databases, transactions, etc. \n• Links to recognized or approved encryption techniques and tools already in use within the enterprise \n• Scope, plan and implementation steps for additional encryption needed for personal data.",

    "Your enterprise should make enhancements to better manage protection levels. The process around protection levels for personal data provides a defined interface (both ways) between general information security and personal data security. Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in protection level analyses.",

    "Your enterprise should make improvements to your resilience process. At a minimum, the resilience process should cover: \n• Personal data criticality, often expressed as a combination of integrity and availability requirements \n• Processing criticality as a function of time, i.e., maximum tolerable period of unavailability, maximum tolerable data loss \n• Recovery plans for personal data sets \n• Defined links to general business continuity and IT service continuity plans \n• Backup and restore concepts for personal data sets, linked to overall backup and restore plans and procedures \n• Multiple instantiations of personal data sets requiring high availability, i.e., fully resilient processing.",

    "Your enterprise needs to more effectively manage access to personal data. Access restrictions and limitations resulting from personal data processing requirements should be documented and fed into the general Identity and Access Management (IAM) process. The access management process for personal data, therefore, provides an interface (both ways) to general Identity and Access Management (IAM). Data Protection and Privacy (DPP) practitioners and enterprises should reflect this by defining appropriate organisational interfaces to support the information flow and the adequate representation of personal data in access management.",

    "Your enterprise's process to manage testing and assessment of personal data security could use another look. At a minimum, the process should address: \n• Types of test and assessment, e.g., conceptual testing, vulnerability scanning and penetration testing \n• Frequency of testing \n• Evidence of continual improvement, i.e., progressively more demanding tests and assessments over time \n• Test logging and securing evidence \n• Analysis of weaknesses and documentation of improvement opportunities.",

    "Your enterprise's process for managing controllers and processors needs attention. The process and processors should cover at least: \n• Identification of primary and joint controllers, including individual or collective purpose(s) for processing personal data \n• Identification of processors, including the defined scope and extent of processing on behalf of one or more controllers \n• Links to the personal data register, reflecting the data sets and the way they are handled across the supply chain (data in flow; data at rest) \n• Links to the processing register, reflecting the processes or process steps performed by each actor in the supply chain \n• Documentation of vendor (processor) management and control arrangements, often embedded into general vendor management of an enterprise",

    "In complex supply chains, the sub-processing management process is an essential element of ensuring  privacy and data protection regulations or norms conformance across the whole supply chain. Your enterprise needs some improvement in this area. The sub-process management process should cover, at a minimum: \n• Formal request procedure to primary processors; disclosure of any further outsourcing \n• Documentation and register of subprocessing, including scope, extent and purpose(s) \n• Evidence of privacy and data protection regulations or norms conformance, including processes, controls, concepts and review results \n• Audit reports and other independent assurance, if available \n• Processing agreements between primary processors and sub-processors",

    "Your enterprise's processing agreements need some work. At a minimum, the process around these agreements should cover: \n• Definition, approval and roll-out of standardised agreements, including templates \n• Monitoring of fulfilment on a regular basis \n• Planning and execution of reviews, primarily under the standard right to audit \n• Receipt, analysis and validation of third-party evidence for conformant processing, e.g., certification and attestation reports \n• Regular review and updating of processing agreements, terms and conditions, in line with legislative and regulatory activity \n• Termination and exit planning for individual contractual relationships",

    "Your enterprise should make enhancements to manage supply chain impact. In a supply chain with multiple actors, impacts resulting from privacy and data protection risks may materialise at any point and at any time. Therefore, Data Protection and Privacy (DPP) practitioners and enterprises should apply their own Data Protection Impact Assessment (DPIA) approach to all parts of the supply chain and document the feedback received from each of the parties. This includes standardised reporting as well as ad hoc reviews or plausibility checks. The overall impact should then be aggregated based on the processing register and the flow of data across various supply chain participants. Care should be taken in understanding how impacts in one place may aggravate impacts in other parts of the supply chain.",

    "Where personal data processing is performed in a supply chain, internal controls at a processor or subprocessor must be as effective as the ones within the controller organisation. Your enterprise's current supply chain controls process is inadequate. At a minimum, the process should cover the following: \n• Obtaining and analysing internal controls documentation from third parties \n• Mapping supply chain controls to the internal control system (ICS) at the controller organisation \n• Procedures for test of design (ToD), i.e., standard techniques for evaluating controls \n• Procedures for test of effectiveness (ToE), i.e., sampling and collecting evidence that demonstrates the effectiveness of controls at third parties \n• Monitoring and log review arrangements, including the accessibility of log data in as much as these, relate to personal data processing \n• Point-in-time or continuous audit rights, including audit planning and deployment",

    "Your enterprise may not be prepared to manage notification in a timely manner. At a minimum, the process of notifying supervisory authorities should include: \n• Information gathering / investigative procedure, outlining the interaction between the Data Protection Officer (DPO) function and other parts of the enterprise and/or external services \n• Standardised reporting package including the minimum privacy and data protection regulations or norms information set and appropriate templates",

    "Your enterprise may not be prepared to notify data subjects in event of an incident or breach. At a minimum, the process of notifying data subjects should cover: \n• Standardised reporting format and templates, adapted to and optimised for various channels of communication (individual, group, public) \n• Predefined and approved key messages expressing the enterprise’s actions (investigation, consequences, remediation, improvement, etc.) \n• Organisational responsibilities with regard to formulating and conveying key messages, e.g., involvement of the communications department, legal advice, etc. \n• Ad hoc communications facilities offered to data subjects, e.g., help line, free phone number, dark site, etc.",

    "Your enterprise's incident and crisis management process has room for improvement. From the perspective of Data Protection and Privacy (DPP) practitioners and organisational units initially discovering the breach, the process should cover at least: \n• Description and documentation of known facts and figures, in a standardised format where appropriate \n• Defined link to general escalation and alerting process, often defined by the business crisis management (BCM) function \n• Predefined generic personal data scenario for business continuity and crisis management, similar to other special scenarios such as cyberattack, pandemic, etc. \n• Predefined relationships and communications channels with external actors, i.e., external services such as investigative or forensics specialists \n• Ongoing communications protocol between organisational line units and incident/crisis management teams.",

    "Your enterprise must make significant efforts towards improving it's preparedness for managing evidence and claims appropriately. Without this progress the organisation is at considerable risk of being found to be negligent and/or of having been part of some sort of criminal activity. To minimise risk the evidence and claims process should cover at a minimum: \n• Defined procedures for collecting and securing evidence, including chain of custody \n• Availability of specialised services such as IT forensics \n• Procedure and templates for post-incident analysis and reporting \n• Procedure for substantiating claims against third parties, including the legal or contractual basis for such claims \n• Procedure for preparing defences against claims by third parties, including aspects of appeal (regulatory decisions) \n• Defined link to post-incident Data Protection Officer (DPO) reporting",

    "Your enterprise's awareness process needs some work. At a minimum, the enterprise-wide awareness process should cover: \n• Definition and description of established privacy and data protection regulations or norms requirements in day-to-day organisational processes, including examples of personal data processing \n• Campaign materials emphasising specific aspects of Data Protection and Privacy (DPP), personal data processing and privacy and data protection related points to note \n• Program/project plans setting target dates for awareness measures \n• Third-party awareness materials and details on how to include third parties in awareness campaigns",

    "Staff in your enterprise may not be adequately prepared to discharge their duties in regards to data protection and privacy matters. Data Protection and Privacy management, including the context of established privacy and data protection regulations or norms, require a set of skills and qualifications that must be present in the enterprise or contracted through external services. The management of skills and education is an essential process to ensure that privacy and data protection regulations or norms and their consequences are fully understood. The skills and education process should include, but not be limited to: \n• Definition of skills, levels and internal requirements for Data Protection and Privacy (DPP) related tasks and positions \n• Mapping of skills to roles and organisational functions (matrix) \n• Identification of suitable qualification levels and formal qualifications or certifications, as needed for each part of the matrix \n• Education paths for different roles and organisational functions in Data Protection and Privacy (DPP) \n• Gathering appropriate educational sources, materials and opportunities for guided or self-study.",

    "Improvements are needed to your enterprise's training process. Training is an important component of overall awareness, providing ongoing learning opportunities and reinforcing the key messages around DPP and privacy and data protection regulations or norms. At a minimum, the training process should cover: \n• Defined and validated basic  privacy and data protection regulations training, preferably mandatory for all members of the enterprise \n• Training concept based on the skills and education matrix \n• Training plan, typically on an annual basis, including internal and external training opportunities \n• Preparation of training materials, guided study and self-study \n• Preparatory training aids for higher qualifications in Data Protection and Privacy (DPP) and privacy and data protection regulations, including certification exam preparation, etc. \n• Defined external training sources and providers for specific purposes, e.g., legal or Data Protection Officer (DPO) training.",

    "Your enterprise needs improvement in its DPO function. At a minimum, the process of maintaining and running the DPO should cover the following: \n• Organisational structure and positioning of the DPO function, including the DPO office and its points of contact in other parts of the enterprise \n• Design of administrative tasks and processes for the DPO function \n• Design of regular work program in an annual cycle \n• Human resource planning, skills and education needs.",

    "Your enterprise has room for improvement in managing the budget and resources of the DPO function. The budgeting and resourcing process should at least cover: \n• Annual financial budget cycle, linking into general budgeting \n• Human resource and headcount planning \n• Technical resource planning, including tools, licensing, etc. \n• External service planning and budgeting, e.g., for consultants or legal advisors \n• Links to general financial reporting within the enterprise.",

    "Your DPO function is not well-represented in the overall enterprise. The management process for organisational interfaces should cover at least: \n• Documentation of regular, formal contacts throughout the enterprise \n• DPO participation in standing committees and other formal institutional meetings \n• Regular communications between the DPO function and other organisational units, including minutes and other reports \n• Documented process steps requiring DPO involvement, including consultation and information (RACI).",

    "Formal internal and external reporting is an important part of the DPO function. Your enterprise has issues that should be addressed in this area. At a minimum, the reporting management process should cover: \n• Reporting schedules for internal and external reporting to and by the DPO function \n• Reporting schedules for supervisory authority reporting \n• Procedures specifying report templates, formal content, frequency and distribution as well as Confidentiality, Integrity and Availability (CIA) ratings for reports \n• Tracking procedure for reporting, covering all reporting schedules.",

    "Based on your response, your enterprise may encounter difficulties managing  privacy and data protection conformance and related requirements that are contracted through external services. The process for managing external services should address, at a minimum: \n• Purpose and substance of external services, including a processing agreement \n• Defined and agreed protection level for the services rendered, specifying confidentiality, integrity and availability \n• Supplier risk analysis, including in-depth checks and due diligence where appropriate \n• Information security analysis \n• Right to audit, analysis of review results and tracking of remedial action \n• Human resource background checking where appropriate and legally permitted.",

    "Your enterprise's data acquisition controls need improvement. At a minimum, the process for managing such controls should address: \n• Identification of organisational processes that may intentionally or incidentally acquire personal data \n• Documentation of inbound data flows and data interfaces (i.e., written, web, other) \n• Identification of data origin where possible (i.e., direct from data subject, controller, processor, other supply chain actors, etc.) \n• Documentation of related controls in the internal controls register.",

    "Your enterprise's processing controls need improvement. The process of maintaining such controls should cover: \n• Identification of process steps, inputs and outputs that are to be controlled \n• Identification of handover points to third parties, e.g., processors or authorities \n• Definition of control objectives and control types (e.g., preventive, detective, corrective) \n• Documentation of related controls in the internal controls register.",

    "Your enterprise's storage controls need improvement. The process of maintaining such controls should cover at least: \n• Identification of storage types and locations for personal data, i.e., storage map \n• Analysis of storage instances within the overall IT architecture \n• Identification of external storage instances, e.g., third party, virtualised, cloud \n• Identification and mapping of handover points between core processes (data in flow) and storage (data at rest) \n• Documentation of related controls in the internal controls register.",

    "Your enterprise's deletion controls need improvement. The process for maintaining deletion controls should cover at least: \n• Identification of deletion points within the overall system \n• Mapping of controls prior to deletion \n• Maintaining a deletion log \n• Mapping of controls after deletion \n• Verification of removal from the personal data register \n• Documentation of related controls in the internal controls register.",

    "Your enterprise's monitoring controls need improvement. The process for maintaining monitoring controls should cover at least: \n• Mapping of personal data processing to overall monitoring, including tools \n• Identification of monitoring needs across the process register \n• Mapping of reporting needs and application to monitoring processes \n• Recurring review of monitoring density and extent \n• Documentation of related controls in the internal controls register.",

    "Your enterprise should make improvements to prepare to manage independent reviews. Managing independent reviews further requires planning steps similar to standard reviews, including notification, fieldwork, analysis and reporting. Data Protection and Privacy (DPP) practitioners and enterprises may benefit from leveraging standardised audit and review processes for Data Protection and Privacy (DPP) reviews. They should further link to the minimum structure and content of Data Protection Officer (DPO) reporting as set down in established privacy and data protection regulations or norms.",


  ];
}


function returnPA_P() {
  return ["É necessário um esforço adicional nesta área. Quando apropriado, a estrutura de governança deve fazer referência a políticas e procedimentos existentes vinculados ao processamento de dados pessoais (por exemplo, a política de segurança da informação ou a política de gerenciamento de identidade e acesso). Da mesma forma, os conceitos e disposições organizacionais e técnicos devem ser referenciados para garantir consistência (por exemplo, quaisquer esquemas de classificação de dados existentes ou a determinação dos níveis de proteção de ativos de informação).",

    "São necessárias melhorias no registro de processamento da sua empresa. Os elementos de governança em torno de um registro de processamento incluem, mas não estão limitados a: \n• Ativos de informações usados ​​(do registro de dados pessoais) \n• Finalidade (s) do processamento \n• Processos de negócios ou outros processos organizacionais que utilizam os ativos \n• Ciclo de vida do processamento desde a aquisição inicial de dados até a exclusão de dados (planejado ou ad hoc) \n• O processo de controle em torno do registro de processamento deve definir ainda mais uma função ou função responsável por manter o registro, bem como a acessibilidade do registro a internos e externos avaliações. Outras disposições de governança podem incluir o escopo e o procedimento para apresentar o registro como evidência, interna e externamente. Nas situações em que o processamento complexo de grandes quantidades de dados pessoais ocorre, o registro deve ser regido por uma política ou procedimento operacional chave adequado.",

    "Sua empresa precisa dar mais atenção a essa área. Uma empresa deve estabelecer, manter, monitorar e adaptar continuamente regras corporativas vinculativas que refletem adequada e abrangente a estrutura de governança interna e externa. Atividades em conjunto com políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. incluem, mas não estão limitados a: \n• Definição, descrição e aprovação de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. pela gerência sênior v• Comunicação de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. \n• Validação e atualização anual ou ad hoc de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empresas ou empresas. \n• Integração de políticas de proteção de dados seguidas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas. em relações contratuais de terceiros \n• Monitoramento de políticas de proteção de dados adotadas por empresas estabelecidas em um país ou conjunto definido de países para transferência de dados pessoais fora do conjunto dentro de um grupo de empreendimentos ou empresas.conformidade interna e externa ",

    "Sua empresa precisa aprimorar suas regras para obter consentimento. No mínimo, as disposições de governança em torno do consentimento devem abranger: \n• Transparência e permitir informações aos titulares dos dados \n• Tipos de consentimento e requisitos relacionados v• Retirada do consentimento dos titulares dos dados v• Processos, controles e verificações específicas para crianças consentimento, incluindo verificação apropriada da idade e / ou autoridade dos pais, bem como consentimento dos pais \n• Canais de comunicação, simplicidade de linguagem e acessibilidade de interfaces baseadas em consentimento ",

    "Sua empresa está minimamente equipada para processar solicitações de titulares de dados. No mínimo, as disposições de governança em relação às solicitações dos titulares de dados devem abranger: \n• Receber e documentar solicitações dos titulares de dados \n• Validação de solicitações relacionadas a objetivos, legal e técnica v• Resposta formal, incluindo canais e formatos de comunicação v• Interfaces para processos internos e da cadeia de suprimentos \n• Interface para registro de dados pessoais e registro de processamento \n• Revisão independente de solicitações pela função Data Protection Officer ",

    "Sua empresa precisa estar melhor equipada para lidar com as reclamações dos titulares de dados\". No mínimo, as disposições de governança em torno das reclamações dos titulares dos dados devem cobrir: \n• Recebimento e documentação inicial, incluindo qualquer resposta formal às autoridades de supervisão \n• Análise de reclamações, incluindo interfaces organizacionais, legais e técnicas dentro da empresa \n• efinição e implementação de soluções, quando aplicável \n• Identificação de possíveis lacunas ou deficiências que levem à reclamação e oportunidades de melhoria ",

    "O processo de governança da sua empresa para garantir que as necessidades de supervisão objetiva funcionem. As atividades em conjunto com a supervisão imparcial incluem, mas não se limitam a: \n• Funções organizacionais que executam e garantem supervisão imparcial \n• Funções e responsabilidades (RACI), incluindo imparcialidade demonstrada \n• Objetivos, escopo e extensão das atividades de supervisão \n• Frequência baseada em riscos das atividades de supervisão \n• Procedimentos e orientações para planejamento, implantação e geração de relatórios ",

    "É necessário um esforço adicional nesta área. No mínimo, as seguintes partes do ciclo devem ser definidas e implementadas: \n• Criação ou aquisição de dados, incluindo a cadeia de processamento de dados pessoais (suprimento) \n• Classificação de ativos de informações, incluindo níveis de proteção e atribuição a categorias especiais v• Inclusão no registro de dados pessoais e no processamento e remoção de registros \n• Processamento real e controles relacionados \n• Armazenamento temporário e permanente, incluindo armazenamento virtualizado e em nuvem \n• Arquivamento e agregação \n• Exclusão, ambas planejadas ( fim da vida útil ou fim da finalidade) e ad hoc (solicitação de apagamento etc.)",

    "São necessárias melhorias no processo da sua empresa para identificar e documentar dados pessoais. O processo de identificação deve, no mínimo, abordar os seguintes aspectos: \n• Definição de critérios de acordo com seus critérios de privacidade e proteção de dados \n• Procedimento para analisar conjuntos de dados existentes, possivelmente em combinação com a análise dos níveis de proteção de segurança (CIA) \n• Procedimento de entrega para registro de dados pessoais \n• Análise de inferência potencial (identificação indireta de pessoas físicas) de conjuntos de dados separados e / ou dispersos \n• Procedimento de integração para novos dados \n• Procedimentos e controles para terceiros partidos",

    "Sua empresa precisa estar melhor equipada para manter a classificação dos dados. No mínimo, a classificação de dados pessoais deve abordar: \n• Atributo geral de \"pessoal\" de acordo com seus critérios de privacidade e proteção de dados; relevância pessoal mais ampla como PII, se necessário \n• Classificação específica relacionada a categorias e finalidades especiais, incluindo limitações e requisitos adicionais de segurança \n• Classificação em termos de não rejeição de transações envolvendo dados pessoais \n• Outros aspectos, como sigilo profissional aplicável ou critérios de acesso restrito ",

    "O registro de dados pessoais da sua empresa precisa ser aprimorado. No mínimo, o processo de registro de dados pessoais deve abordar: \n• Tipo de dados e agregação (se houver) em ativos de informação \n• Links relevantes entre conjuntos de dados que formam ativos de informação sob seus critérios de privacidade e proteção de dados v• Tipos e formatos de dados, incluindo dados não mantidos em formatos eletrônicos (por exemplo, papel, microficha) \n• Localização e instanciação de dados, incluindo várias cópias, imagens virtualizadas e em nuvem, etc. \n• Informações sobre o ciclo de vida e o tempo de vida, incluindo planejado arquivamento e exclusão \n• Etapas de processamento vinculadas, unidades organizacionais e finalidades de processamento, detalhando claramente quando, por que, onde e por quem do processamento de dados pessoais ",

    "Sua empresa está minimamente equipada para gerenciar dados de categorias especiais. Isso requer um processo robusto que identifica, controla e documenta qualquer processamento de dados pertencentes a uma ou mais categorias especiais, abrangendo no mínimo, mas não limitado a: \n• Mapeamento de ativos de informações identificadas para categorias especiais, de acordo com seus critérios para privacidade e proteção de dados \n• Documentação de circunstâncias justificativas (conforme seus critérios de privacidade e proteção de dados) para cada ativo de informação \n• Documentação de qualquer classificação nova ou alterada desses ativos de informação \n• Documentação de todas as comunicações com os titulares de dados ou autoridades de supervisão relacionadas ao ativo de informação \n• Documentação do consentimento relacionado ao ativo e retirada do consentimento \n• Links verificados para o registro de dados pessoais e o registro de processamento, incluindo evidências de processamento restrito ao (s) objetivo (s) definido (s) ",

    "Sua empresa pode não estar preparada para responder adequadamente às demandas de apagamento. O processo deve, no mínimo, abordar os seguintes aspectos: \n• Recebimento, confirmação e análise de solicitações de apagamento por titulares de dados ou autoridades competentes \n• Validação e internalização de solicitações de apagamento transferidas por terceiros \n• Interfaces definidas para outros processos, isto é, registro de dados pessoais e registro de processamento, classificação e ciclo de vida dos dados \n• Aprovações e procedimentos de verificação independente para eliminação \n• Procedimento de confirmação e comunicação de apagamento (para pessoas ou autoridades de dados) ",

    "Se você ainda não o fez, sua empresa deve realizar uma avaliação de risco completa. Os resultados da avaliação de riscos devem incluir, no mínimo: \n• Registro abrangente de eventos e ameaças que levem aos seus critérios para categorias de risco de privacidade e proteção de dados \n• Estimativas de frequência e premissas de precaução \n• Agregação e agrupamento de eventos principais com os mesmos riscos que se materializam \n• Classificação de risco, geralmente de acordo com o esquema de classificação de risco organizacional abrangente ",

    "Se você ainda não o fez, sua empresa deve realizar uma avaliação completa do impacto na proteção de dados. A DPIA deve levar em conta os controles existentes e as medidas de mitigação de risco, e deve identificar o impacto potencial resultante do risco residual que não foi ou não pode ser totalmente mitigado.",

    "Sua empresa deve fazer melhorias para gerenciar melhor o tratamento de riscos. O processo de tratamento de riscos deve, no mínimo, abranger o seguinte: \n• Evitar ou eliminar riscos, incluindo alterações nas disposições de processamento ou descontinuar o processamento (reestruturar ou sair) \n• Eliminação de riscos por meio de controles ou salvaguardas adicionais \n• Riscos transferência, incluindo a reestruturação da cadeia de suprimento de dados pessoais \n• Redução de riscos por meio de controles adicionais ou medidas de mitigação \n• Tolerância ao risco, com base na frequência e impacto estimados ",

    "Sua empresa deve revisar seu processo de validação de riscos quanto a deficiências. No mínimo, o processo de validação de risco deve abordar: \n• Confirmação (ou alteração) dos resultados da avaliação de risco, incluindo estimativas de frequência e o universo de eventos / ameaças \n• Revisão da eficácia das medidas e atividades de tratamento, com base em um período razoável de observação \n• Revisão de quaisquer incidentes ou violações que possam ter ocorrido desde a última validação \n• Análise de quaisquer alterações na estrutura e nos termos de referência, ou seja, em relação a quaisquer eventos legislativos ou regulamentares, políticos ou financeiros ",

    "Sua empresa pode usar alguma melhoria nesta área. O anonimato e a pseudonimização devem abranger, mas não estão limitados a: \n• Identificação de conjuntos de dados pessoais a serem anonimizados / pseudonimizados \n• Definição de técnicas em todos os níveis técnicos, por exemplo, arquivo, registro de banco de dados, sistemas de arquivos não eletrônicos \n• Documentação e registro do anonimato / pseudonimização real \n• Link definido para o registro de dados pessoais e o registro de processamento \n• Aplicação recursiva do princípio da necessidade de conhecimento em toda a cadeia de suprimentos; integração da necessidade real de conhecer o gerenciamento de identidades e acessos",

    "A estratégia de criptografia e seus componentes devem se basear em risco e eficiência, garantindo que seus critérios para riscos de privacidade e proteção de dados sejam totalmente compreendidos e internalizados em qualquer decisão. Sua empresa deve fazer melhorias nessa área. No mínimo, o processo de criptografia deve abordar: \n• Conjunto definitivo de dados pessoais e ativos de informações a serem criptografados, com base nos níveis de proteção atribuídos e nos seus critérios de privacidade e risco e impacto na proteção de dados \n• Definição de técnicas de criptografia e metas, por exemplo, dados individuais, elementos de banco de dados, bancos de dados inteiros, transações, etc. \n• Links para técnicas e ferramentas de criptografia reconhecidas ou aprovadas, já em uso na empresa \n• Escopo, planejamento e etapas de implementação para criptografia adicional necessária para dados pessoais",

    "Sua empresa deve fazer aprimoramentos para gerenciar melhor os níveis de proteção. O processo em torno dos níveis de proteção de dados pessoais fornece uma interface definida (nos dois sentidos) entre a segurança geral das informações e a segurança dos dados pessoais. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada dos dados pessoais nas análises do nível de proteção. ",

    "Sua empresa deve fazer melhorias no seu processo de resiliência. No mínimo, o processo de resiliência deve cobrir: \n• Criticidade de dados pessoais, geralmente expressa como uma combinação de requisitos de integridade e disponibilidade \n• Criticidade de processamento em função do tempo, isto é, período máximo tolerável de indisponibilidade, perda máxima tolerável de dados \n• Planos de recuperação para conjuntos de dados pessoais \n• Links definidos para planos gerais de continuidade de negócios e serviços de TI \n• Conceitos de backup e restauração de conjuntos de dados pessoais, vinculados a planos e procedimentos gerais de backup e restauração \n• Instância múltipla de conjuntos de dados pessoais que exigem alta disponibilidade, ou seja, processamento totalmente resiliente ",

    "Sua empresa precisa gerenciar com mais eficiência o acesso aos dados pessoais. As restrições e limitações de acesso resultantes de requisitos de processamento de dados pessoais devem ser documentadas e alimentadas no processo geral do IAM. O processo de gerenciamento de acesso a dados pessoais, portanto, fornece uma interface (nos dois sentidos) para o IAM geral. Os profissionais e empresas do DPP devem refletir isso definindo interfaces organizacionais apropriadas para apoiar o fluxo de informações e a representação adequada de dados pessoais no gerenciamento de acesso. ",

    "O processo da sua empresa para gerenciar testes e avaliação da segurança de dados pessoais pode usar outra aparência. No mínimo, o processo deve abordar: \n• Tipos de teste e avaliação, por exemplo, teste conceitual, verificação de vulnerabilidade e teste de penetração \n• Frequência do teste \n• Evidência de melhoria contínua, ou seja, testes e avaliações progressivamente mais exigentes com o tempo \n• Teste de registro e proteção de evidências \n• Análise de pontos fracos e documentação de oportunidades de melhoria ",

    "O processo da sua empresa para gerenciar controladores e processadores precisa de atenção. O processo e os processadores devem abranger pelo menos: \n• Identificação de controladores primários e conjuntos, incluindo objetivos individuais ou coletivos para o processamento de dados pessoais \n• Identificação de processadores, incluindo o escopo definido e a extensão do processamento em nome de um ou mais controladores \n• Links para o registro de dados pessoais, refletindo os conjuntos de dados e a maneira como eles são tratados na cadeia de suprimentos (dados em fluxo; dados em repouso) \n• Links para o registro de processamento, refletindo os processos ou processos etapas executadas por cada ator na cadeia de suprimentos\n • Documentação dos acordos de gerenciamento e controle de fornecedores (processadores), geralmente incorporados ao gerenciamento geral de fornecedores de uma empresa ",

    "Em cadeias de suprimentos complexas, o processo de gerenciamento de subprocessamento é um elemento essencial para garantir seus critérios de privacidade e conformidade de proteção de dados em toda a cadeia de suprimentos. Sua empresa precisa de melhorias nessa área. O processo de gerenciamento de subprocessos deve cobrir, no mínimo: \n• Procedimento formal de solicitação aos processadores primários; divulgação de qualquer terceirização adicional \n• Documentação e registro de subprocessamento, incluindo escopo, extensão e objetivo (s) \n• Evidência de seus critérios de conformidade com a privacidade e proteção de dados, incluindo processos, controles, conceitos e resultados de revisão \n• Auditoria relatórios e outras garantias independentes, se disponíveis \n• Processamento de contratos entre processadores primários e subprocessadores ",

    "Os contratos de processamento da sua empresa precisam de algum trabalho. No mínimo, o processo em torno desses acordos deve abranger: \n• Definição, aprovação e implementação de acordos padronizados, incluindo modelos \n• Monitoramento regular do cumprimento \n• Planejamento e execução de revisões, principalmente sob o direito padrão de auditoria \n• Recebimento, análise e validação de evidências de terceiros para processamento conforme, por exemplo, relatórios de certificação e atestado \n• Revisão e atualização regulares de contratos, termos e condições de processamento, de acordo com a atividade legislativa e regulamentar \nPlanejamento de término e saída para relações contratuais individuais ",

    "Sua empresa deve fazer aprimoramentos para gerenciar o impacto na cadeia de suprimentos. Em uma cadeia de suprimentos com vários atores, os impactos resultantes de seus critérios para riscos de privacidade e proteção de dados podem se materializar a qualquer momento e a qualquer momento. Portanto, profissionais e empresas de DPP devem aplicar sua própria abordagem de DPIA a todas as partes da cadeia de suprimentos e documentar o feedback recebido de cada uma das partes. Isso inclui relatórios padronizados, bem como revisões ad hoc ou verificações de plausibilidade. O impacto geral deve ser agregado, com base no registro de processamento e no fluxo de dados entre os vários participantes da cadeia de suprimentos. Deve-se tomar cuidado para entender como os impactos em um local podem agravar os impactos em outras partes da cadeia de suprimentos. ",

    "Quando o processamento de dados pessoais é realizado em uma cadeia de suprimentos, os controles internos de um processador ou subprocessador devem ser tão eficazes quanto os da organização do controlador. O atual processo de controle da cadeia de suprimentos da sua empresa é inadequado. No mínimo, o processo deve abranger o seguinte: \n• Obtenção e análise de documentação de controles internos de terceiros \n• Mapeamento para o sistema de controle interno (ICS) na organização do controlador \n• Procedimentos para teste de projeto (ToD), ou seja, técnicas padrão para avaliação de controles \n• Procedimentos para teste de eficácia (ToE), ou seja, amostragem e coleta de evidências que demonstram a eficácia dos controles de terceiros \n• Arranjos de monitoramento e revisão de logs, incluindo acessibilidade dos dados de log, na medida em que elas estão relacionadas ao processamento de dados pessoais \n• Direitos de auditoria pontuais ou contínuos, incluindo planejamento e implantação de auditoria ",

    "Sua empresa pode não estar preparada para gerenciar a notificação em tempo hábil. No mínimo, o processo de notificação às autoridades de supervisão deve incluir: \n• Procedimento de coleta / investigação de informações, descrevendo a interação entre a função do Oficial de Proteção de Dados e outras partes da empresa e / ou serviços externos \n• Pacote de relatórios padronizado, incluindo o mínimo seus critérios para o conjunto de informações sobre privacidade e proteção de dados e modelos apropriados ",

    "Sua empresa pode não estar preparada para notificar os titulares dos dados em caso de incidente ou violação. No mínimo, o processo de notificação dos titulares dos dados deve abranger: \n• Formato e modelos de relatório padronizados, adaptados e otimizados para vários canais de comunicação (indivíduo, grupo, público) \n• Mensagens principais predefinidas e aprovadas que expressam as ações da empresa (investigação, conseqüências, remediação, aprimoramento etc.) \n• Responsabilidades organizacionais em relação à formulação e transmissão de mensagens-chave, por exemplo, envolvimento do departamento de comunicações, aconselhamento jurídico, etc. \n• Recursos de comunicação ad hoc oferecidos aos titulares dos dados , por exemplo, linha de ajuda, número de telefone gratuito, site escuro etc. ",

    "O processo de gerenciamento de incidentes e crises da sua empresa tem espaço para melhorias. Da perspectiva dos profissionais de DPP e das unidades organizacionais que inicialmente descobriram a violação, o processo deve cobrir pelo menos: \n• Descrição e documentação de fatos e números conhecidos, em um formato padronizado, quando apropriado \n• Link definido para o processo geral de escalação e alerta , geralmente definido pela função de gerenciamento de crises empresariais (BCM) \n• Cenário de dados pessoais genéricos predefinidos para continuidade dos negócios e gerenciamento de crises, semelhante a outros cenários especiais, como ataque cibernético, pandemia, etc. \n• Relacionamentos e canais de comunicação predefinidos com canais externos atores, ou seja, serviços externos, como especialistas em investigação ou forenses \n• Protocolo de comunicação em andamento entre unidades de linha organizacional e equipes de gerenciamento de incidentes / crises ",

    "Sua empresa deve estar melhor preparada para gerenciar evidências e reivindicações de forma adequada. As violações de dados pessoais representam casos de não conformidade, mas também indicam que negligência interna e / ou externa ou atividade criminosa pode estar presente. O processo de evidência e reclamações deve, portanto, abranger, no mínimo: \n• Procedimentos definidos para coletar e proteger evidências, incluindo cadeia de custódia \n• Disponibilidade de serviços especializados, como forense de TI \n• Procedimento e modelos para análise pós-incidente e relatórios \n• Procedimento para fundamentar reivindicações contra terceiros, incluindo a base legal ou contratual para tais reivindicações \n• Procedimento para preparar defesas contra reivindicações de terceiros, incluindo aspectos de apelação (decisões regulatórias) \n• Link definido para postar incidentes Responsável pela proteção de dados ",

    "O processo de conscientização da sua empresa precisa de algum trabalho. No mínimo, o processo de conscientização em toda a empresa deve abranger: \n• Definição e descrição de seus critérios para requisitos de privacidade e proteção de dados nos processos organizacionais diários, incluindo exemplos de processamento de dados pessoais \n• Materiais de campanha enfatizando aspectos específicos de DPP, processamento de dados pessoais e seus critérios para pontos relacionados à privacidade e à proteção de dados a serem observados \n• Planos de programas / projetos que definem datas-alvo para medidas de conscientização \n• Materiais de conscientização de terceiros e detalhes sobre como incluir terceiros em campanhas de conscientização ",

    "Os funcionários da sua empresa podem não estar adequadamente preparados para cumprir suas obrigações em relação a questões de proteção de dados e privacidade. A proteção de dados e o gerenciamento de privacidade, incluindo o contexto de seus critérios de privacidade e proteção de dados, exigem um conjunto de habilidades e qualificações que devem estar presentes na empresa ou contratadas por meio de serviços externos. O gerenciamento de habilidades e educação é um processo essencial para garantir que seus critérios de privacidade e proteção de dados e suas conseqüências sejam totalmente compreendidos. O processo de habilidades e educação deve incluir, mas não se limitar a: \n• Definição de habilidades, níveis e requisitos internos para tarefas e posições relacionadas ao DPP \n• Mapeamento de habilidades para cargos e funções organizacionais (matriz) \nIdentificação de níveis de qualificação adequados e qualificações ou certificações formais, conforme necessário para cada parte da matriz \n• Caminhos de educação para diferentes funções e funções organizacionais no DPP \n• Reunir fontes, materiais e oportunidades educacionais apropriadas para orientação ou auto-estudo ",

    "São necessárias melhorias no processo de treinamento da sua empresa. O treinamento é um componente importante da conscientização geral, oferecendo oportunidades contínuas de aprendizado e reforçando as principais mensagens sobre o DPP e seus critérios de privacidade e proteção de dados. No mínimo, o processo de treinamento deve abranger: \n• Definidos e validados seus critérios básicos para treinamento em privacidade e proteção de dados, preferencialmente obrigatórios para todos os membros da empresa \n• Conceito de treinamento baseado na matriz de habilidades e educação \n• Treinamento plano, normalmente anualmente, incluindo oportunidades de treinamento interno e externo \n• Preparação de materiais de treinamento para estudo guiado e auto-estudo \n• Auxílios de treinamento preparatório para qualificações mais altas no DPP e seus critérios de privacidade e proteção de dados, incluindo preparação para exames de certificação, etc. \nFontes e provedores externos de treinamento definidos para fins específicos, por exemplo, treinamento jurídico ou de proteção de dados ",

    "Sua empresa precisa de melhorias na função de Responsável pela proteção de dados. No mínimo, o processo de manutenção e execução do Responsável pela proteção de dados deve abranger o seguinte: \n• Estrutura organizacional e posicionamento da função de Responsável pela proteção de dados, incluindo o escritório do Responsável pela proteção de dados e seus pontos de contato em outras partes da empresa \n• Projeto de tarefas e processos administrativos para a função de Oficial de Proteção de Dados \n• Projeto de programa de trabalho regular em um ciclo anual \n• Planejamento de recursos humanos, habilidades e necessidades educacionais ",

    "Sua empresa tem espaço para melhorias no gerenciamento do orçamento e dos recursos da função Responsável pela proteção de dados. O processo de orçamento e recursos deve abranger pelo menos: \n• Ciclo anual do orçamento financeiro, vinculando-se ao orçamento geral \n• Planejamento de recursos humanos e número de funcionários \n• Planejamento técnico de recursos, incluindo ferramentas, licenciamento, etc. \n• Planejamento de serviços externos e orçamento, por exemplo, para consultores ou consultores jurídicos \n• Links para relatórios financeiros gerais dentro da empresa ",

    "Sua função de oficial de proteção de dados não está bem representada na empresa em geral. O processo de gerenciamento de interfaces organizacionais deve abranger pelo menos: \n• Documentação de contatos regulares e formais em toda a empresa \n• Participação do Diretor de proteção de dados em comitês permanentes e outras reuniões institucionais formais \n• Comunicações regulares entre a função do Diretor de proteção de dados outras unidades organizacionais, incluindo atas e outros relatórios \n• Etapas do processo documentadas que exigem o envolvimento do Data Protection Officer, incluindo consulta e informação (RACI) ",

    "Os relatórios internos e externos formais são uma parte importante da função de Responsável pela proteção de dados. Sua empresa tem problemas que devem ser abordados nesta área. No mínimo, o processo de gerenciamento de relatórios deve abranger: \n• Agendas de relatórios para relatórios internos e externos para e pela função Responsável pela Proteção de Dados \nAgendas de relatórios para relatórios de autoridades de supervisão \n• Procedimentos que especificam modelos de relatórios, conteúdo formal, frequência e distribuição, bem como classificações da CIA para relatórios \n• Procedimento de rastreamento para geração de relatórios, cobrindo todas as programações de relatórios ",

    "Com base na sua resposta, sua empresa pode encontrar dificuldades para gerenciar seus critérios de conformidade de privacidade e proteção de dados e requisitos relacionados que são contratados por meio de serviços externos. O processo de gerenciamento de serviços externos deve abordar, no mínimo: \n• Finalidade e substância dos serviços externos, incluindo um contrato de processamento \n• Nível de proteção definido e acordado para os serviços prestados, especificando confidencialidade, integridade e disponibilidade \n• Fornecedor análise de risco, incluindo verificações aprofundadas e due diligence, quando apropriado \n• Análise de segurança da informação \n• Direito de auditar, analisar resultados de revisão e rastrear ações corretivas v• Verificação de antecedentes de recursos humanos, quando apropriado e permitido legalmente ",

    "Os controles de aquisição de dados da sua empresa precisam ser aprimorados. No mínimo, o processo para gerenciar esses controles deve abordar: \n• Identificação de processos organizacionais que podem intencionalmente ou acidentalmente adquirir dados pessoais \n• Documentação de fluxos de dados de entrada e interfaces de dados (por exemplo, escritos, web, outros) \n• Identificação da origem dos dados sempre que possível (ou seja, diretamente do titular dos dados, controlador, processador, outros atores da cadeia de suprimentos, etc.) \n• Documentação dos controles relacionados no registro de controles internos ",

    "Os controles de processamento da sua empresa precisam ser aprimorados. O processo de manutenção de tais controles deve abranger: \n• Identificação das etapas do processo, entradas e saídas que devem ser controladas \n• Identificação dos pontos de transferência para terceiros, por exemplo, processadores ou autoridades \n• Definição dos objetivos e controle do controle tipos (por exemplo, preventivo, detetive, corretivo) \n• Documentação dos controles relacionados no registro de controles internos ",

    "Os controles de armazenamento da sua empresa precisam ser aprimorados. O processo de manutenção de tais controles deve abranger pelo menos:\n • Identificação de tipos e locais de armazenamento de dados pessoais, como mapa de armazenamento \n• Análise de instâncias de armazenamento na arquitetura geral de TI \n• Identificação de instâncias de armazenamento externo, por exemplo , terceirizado, virtualizado, nuvem \n• Identificação e mapeamento de pontos de transferência entre processos principais (dados em fluxo) e armazenamento (dados em repouso) \n• Documentação de controles relacionados no registro de controles internos ",

    "Os controles de exclusão da sua empresa precisam ser aprimorados. O processo para manter controles de exclusão deve abranger pelo menos: \n• Identificação de pontos de exclusão no sistema geral \n• Mapeamento de controles antes da exclusão \n• Manutenção de um log de exclusão \n• Mapeamento de controles após exclusão \n• Verificação remoção do registro de dados pessoais \n• Documentação de controles relacionados no registro de controles internos ",

    "Os controles de monitoramento da sua empresa precisam ser aprimorados. O processo para manter os controles de monitoramento deve abranger pelo menos: \n• Mapeamento do processamento de dados pessoais para o monitoramento geral, incluindo ferramentas \n• Identificação das necessidades de monitoramento no registro do processo \n• Mapeamento das necessidades de relatórios e aplicação nos processos de monitoramento \n• Revisão recorrente da densidade e extensão do monitoramento \n• Documentação dos controles relacionados no registro de controles internos ",

    "Sua empresa deve fazer melhorias para se preparar para gerenciar revisões independentes. O gerenciamento de revisões independentes requer etapas de planejamento semelhantes às revisões padrão, incluindo notificação, trabalho de campo, análise e relatório. Os profissionais e empresas do DPP podem se beneficiar da alavancagem de processos padronizados de auditoria e revisão para análises do DPP. Eles devem ainda vincular-se à estrutura e ao conteúdo mínimos dos relatórios do Data Protection Officer, conforme estabelecido em seus critérios de privacidade e proteção de dados. ",


  ];
}


class PDFDocumentWithTables extends PDFDocument {
  constructor(options) {
    super(options);
  }

  table(table, arg0, arg1, arg2) {
    let startX = this.page.margins.left; let startY = this.y;
    let options = {};

    if ((typeof arg0 === "number") && (typeof arg1 === "number")) {
      startX = arg0;
      startY = arg1;

      if (typeof arg2 === "object") {
        options = arg2;
      }
    } else if (typeof arg0 === "object") {
      options = arg0;
    }

    const columnCount = table.headers.length;
    const columnSpacing = options.columnSpacing || 15;
    const rowSpacing = options.rowSpacing || 5;
    const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

    const prepareHeader = options.prepareHeader || (() => {});
    const prepareRow = options.prepareRow || (() => {});
    const computeRowHeight = (row) => {
      let result = 0;

      row.forEach((cell) => {
        const cellHeight = this.heightOfString(cell, {
          width: columnWidth,
          align: "left",
        });
        result = Math.max(result, cellHeight);
      });

      return result + rowSpacing;
    };

    const columnContainerWidth = usableWidth / columnCount;
    const columnWidth = columnContainerWidth - columnSpacing;
    const maxY = this.page.height - this.page.margins.bottom;

    let rowBottomY = 0;

    this.on("pageAdded", () => {
      startY = this.page.margins.top;
      rowBottomY = 0;
    });

    // Allow the user to override style for headers
    prepareHeader();

    // Check to have enough room for header and first rows
    if (startY + 3 * computeRowHeight(table.headers) > maxY) {
      this.addPage();
    }

    // Print all headers
    table.headers.forEach((header, i) => {
      this.text(header, startX + i * columnContainerWidth, startY, {
        width: columnWidth,
        align: "left",
      });
    });

    // Refresh the y coordinate of the bottom of the headers row
    rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

    // Separation line between headers and rows
    this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
        .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
        .lineWidth(2)
        .stroke();

    table.rows.forEach((row, i) => {
      const rowHeight = computeRowHeight(row);

      // Switch to next page if we cannot go any further because the space is over.
      // For safety, consider 3 rows margin instead of just one
      if (startY + 3 * rowHeight < maxY) {
        startY = rowBottomY + rowSpacing;
      } else {
        this.addPage();
      }

      // Allow the user to override style for rows
      prepareRow(row, i);

      // Print all cells of the current row
      row.forEach((cell, i) => {
        this.text(cell, startX + i * columnContainerWidth, startY, {
          width: columnWidth,
          align: "left",
        });
      });

      // Refresh the y coordinate of the bottom of this row
      rowBottomY = Math.max(startY + rowHeight, rowBottomY);

      // Separation line between rows
      this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
          .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
          .lineWidth(1)
          .opacity(0.7)
          .stroke()
          .opacity(1); // Reset opacity after drawing the line
    });

    this.x = startX;
    this.moveDown();

    return this;
  }
}

// module.exports = PDFDocumentWithTables;


function getResponseArray(language) {
  if (language==="English") {
    return [
      "Password management: Strong passwords are the basis for security and must be compulsory for all users within the organisation. Passwords must be sufficiently long and complex, chosen by the users themselves and regularly changed. After a number of attempts using incorrect passwords the account should be temporarily blocked.  The importance of strong passwords, which are not to be shared with others, must be made clear to users.",
      "Identity access management: users must only have access to the applications, functionality and the data in line with their business needs. Too broad access rights can lead to data leaks and misuse.",

      "Management of Admin accounts:  administrator accounts can provide unlimited access to systems and applications and only a few employees, typically from the IT department, should have access to them. Proper manage of these admin accounts and their passwords is important, especially when third parties, e.g. IT suppliers, also have access to these accounts.",

      "Operating System Security management: e.g. the security of the Windows environment is managed by Active Directory. Since Windows is a common operating system in many organisations and Active directory specifies access appropriate management of this is important.",

      "Back-up and recovery: Good tools and procedures should be put in place so that critical data and systems are backed up at regular intervals, which can be restored UN the event of a problem.",

      "Malware protection:  Malware is a generic term for viruses. A good malware solution that is regularly updated and implemented, protects the organisations against the installation, distribution and execution of malicious code.",

      "Awareness training: People are the weakest link in cyber security as they make mistakes, they cannot be 'patched' and their behaviour and habits are hard to change. Employers must therefore be trained to understand the importance of cyber security and to recognise dangerous situations so that they can be guided towards safe behaviour.",

      "Patch management: Attackers often want to exploit known vulnerabilities in the software of systems and network devices. That is why it is important to install the latest patches regularly.",

      "Vulnerability management: Attackers want to exploit vulnerabilities in the configuration of the systems and network devices. Vulnerability management ensures that these vulnerabilities are identified, assessed and resolved.",

      "Device management: active management of the security configuration of mobile devices, laptops, servers and workstations.",

      "Network security and remote access for employers and partners: Your network should be managed so that only authorised devices can access the network and non-authorised devices are prevented from accessing the network.",

      "Security logging: Using security logging at network and application level, actions are recorded so that suspicious or unauthorised actions can be identifies and appropriate action can be taken in a timely manner.",

      "Incident response: Be prepared to respond to cyber incidents from the moment of first detection of an attack.",

      "Disaster recovery plan: Be prepared to rebuild your entire IT environment from zero in the event of serious calamities, which also includes a major cyber-attack.",

      "Inventory control of hardware and software: Active management, i.e. taking inventory, follow-up and correction, of all software and hardware assets within the organisation network so that only authorised software and hardware is allowed.",

      "Multi-factor authentication:  the use of various authentication techniques in addition to passwords (finger print, face recognition, ID card, token, etc.) in order to verify the identity of the user.",

      "Periodic penetration testing: With this a controlled external cyber-attack is carried out at the request of the customer within a formally agreed framework., using techniques and tools that hackers use. This allows the assessment of what damage could be caused by a hacker and how this can be prevented.",

      "Security monitoring; The continual monitoring of the organisation-network and systems facilitates the timely identification of suspicious activities based on signals and patterns to allow the organisation to respond adequately. This includes end-point, server and network monitoring.",

      "Database security and operating software hardening: the use of advanced tools and processes to prevent direct access to data in order to ensure the confidentiality and integrity of sensitive information.",

      "Application hardening: Ensuring optimal security for sensitive application, whereby standard configurations and passwords are modified.",

      "Encryption: The use of encryption to secure data, e.g. data base encryption, e-mail traffic, data carriers.",

    ];
  } else {
    return ["Gerenciamento de senhas: senhas fortes são a base da segurança e devem ser obrigatórias para todos os usuários da organização. As senhas devem ser suficientemente longas e complexas, escolhidas pelos próprios usuários e alteradas regularmente. Após várias tentativas usando senhas incorretas, a conta deve temporariamente bloqueado. A importância de senhas fortes, que não devem ser compartilhadas com outras pessoas, deve ficar clara para os usuários. ",

      "Gerenciamento de acesso à identidade: os usuários devem ter apenas acesso aos aplicativos, funcionalidade e dados de acordo com suas necessidades comerciais. Direitos de acesso muito amplos podem levar a vazamentos de dados e uso indevido.",

      "Gerenciamento de contas de administrador: as contas de administrador podem fornecer acesso ilimitado a sistemas e aplicativos e apenas alguns funcionários, geralmente do departamento de TI, devem ter acesso a eles. O gerenciamento adequado dessas contas de administrador e suas senhas é importante, especialmente quando terceiros , por exemplo, fornecedores de TI, também têm acesso a essas contas. ",

      "Gerenciamento da segurança do sistema operacional: por exemplo, a segurança do ambiente do Windows é gerenciada pelo Active Directory. Como o Windows é um sistema operacional comum em muitas organizações, o Active Directory especifica o acesso ao gerenciamento apropriado disso é importante.",

      "Backup e recuperação: Boas ferramentas e procedimentos devem ser implementados para que dados e sistemas críticos sejam armazenados em backup em intervalos regulares, que podem ser restaurados pela ONU no caso de um problema.",

      "Proteção contra malware: malware é um termo genérico para vírus. Uma boa solução de malware atualizada e implementada regularmente protege as organizações contra a instalação, distribuição e execução de código malicioso.",

      "Treinamento de conscientização: as pessoas são o elo mais fraco da segurança cibernética, pois cometem erros, não podem ser 'corrigidas' e seus comportamentos e hábitos são difíceis de mudar. Portanto, os empregadores devem ser treinados para entender a importância da segurança cibernética e reconhecer situações perigosas. para que possam ser orientados para um comportamento seguro. ",

      "Gerenciamento de patches: os invasores geralmente desejam explorar vulnerabilidades conhecidas no software de sistemas e dispositivos de rede. É por isso que é importante instalar os patches mais recentes regularmente.",

      "Gerenciamento de vulnerabilidades: os invasores desejam explorar vulnerabilidades na configuração dos sistemas e dispositivos de rede. O gerenciamento de vulnerabilidades garante que essas vulnerabilidades sejam identificadas, avaliadas e resolvidas.",

      "Gerenciamento de dispositivos: gerenciamento ativo da configuração de segurança de dispositivos móveis, laptops, servidores e estações de trabalho.",

      "Segurança de rede e acesso remoto para empregadores e parceiros: sua rede deve ser gerenciada para que apenas dispositivos autorizados possam acessar a rede e dispositivos não autorizados sejam impedidos de acessar a rede.",

      "Registro de segurança: usando o registro de segurança no nível da rede e do aplicativo, as ações são registradas para que ações suspeitas ou não autorizadas possam ser identificadas e ações apropriadas possam ser executadas em tempo hábil.",

      "Resposta a incidentes: esteja preparado para responder a incidentes cibernéticos a partir do momento da primeira detecção de um ataque.",

      "Plano de recuperação de desastre: esteja preparado para reconstruir todo o seu ambiente de TI do zero em caso de calamidades graves, o que também inclui um grande ataque cibernético.",

      "Controle de inventário de hardware e software: gerenciamento ativo, ou seja, inventário, acompanhamento e correção de todos os ativos de software e hardware na rede da organização, de modo que apenas o software e o hardware autorizados sejam permitidos.",

      "Autenticação multifatorial: uso de várias técnicas de autenticação, além de senhas (impressão digital, reconhecimento facial, bilhete de identidade, token etc.) para verificar a identidade do usuário.",

      "Teste periódico de penetração: com isso, um ciberataque externo controlado é realizado a pedido do cliente, dentro de uma estrutura formalmente acordada., Usando técnicas e ferramentas usadas pelos hackers. Isso permite avaliar quais danos podem ser causados ​​por um hacker. e como isso pode ser evitado. ",

      "Monitoramento de segurança; o monitoramento contínuo da rede e dos sistemas da organização facilita a identificação oportuna de atividades suspeitas com base em sinais e padrões para permitir que a organização responda adequadamente. Isso inclui monitoramento de ponto final, servidor e rede.",

      "Segurança do banco de dados e proteção do software operacional: o uso de ferramentas e processos avançados para impedir o acesso direto aos dados, a fim de garantir a confidencialidade e a integridade das informações confidenciais.",

      "Proteção de aplicativos: garantindo segurança ideal para aplicativos confidenciais, através da qual as configurações e senhas padrão são modificadas.",

      "Criptografia: o uso da criptografia para proteger dados, por exemplo, criptografia de banco de dados, tráfego de email, suportes de dados.",

    ];
  } // end if then else
}

function writeToReport(responseArray, indicesToPrint, pdf) {
  let index;
  let element; // the number of the sentence to write
  pdf.fontSize(12);
  pdf.font("Times-Roman");
  for (index = 0; index < indicesToPrint.length; ++index) {
    element= indicesToPrint[index];
    pdf.moveDown();
    pdf.text(responseArray[element-1], 72), { };
  } // end of loop
}
function getCoordsOnArc(angle, offset=10) {
  return [
    Math.cos(angle - (Math.PI / 2)) * offset,
    Math.sin(angle - (Math.PI / 2)) * offset,
  ];
}

//* ************************************************** */

function sendJson(fs, os, usersRef, gmailEmail, gmailPassword, ccID,
    companyName, receiverID, userId, username, table0) {
  console.log("in sendJson");
  const path=require("path");
  const fileName=companyName.toUpperCase() +".json";
  let tempFilePath = path.join(os.tmpdir(), fileName);

  // let username;


  // const userName=capitalizeFirstLetter(original.username);

  // userId = admin.auth().currentUser.userId; //This is the firebase unique user ID


  // const usersRef = admin.database().ref('/combinedusers/' + userId);
  // usersRef.update(cust);

  //       usersRef.update({shouldSendJson: "no"})


  // Important: Always return results, otherwise callbacks won't catch
  // the result of a previous promise


  usersRef.once("value").then((snapshot) => { //  GETTING THE DATA FOR THE SUBMISSION
    const data2= snapshot.val();
    // let username= data2.username;
    const language=data2.language;
    // console.log("username    " + username)
    // //console.log("Language in email    " + language)
    const shouldemailJson=data2.shouldemailJson;
    if (shouldemailJson!=="yes" ) {
      console.log("Exiting sendEmailConfirmation");
    }
    if (shouldemailJson!=="yes" ) {
      return null;
    }

    usersRef.update({shouldemailJson: "no"});


    let capitalised;
    capitalised=capitalizeFirstLetter(username);

    //    q     ["2","3","0","2","2","1","1","2","1","2","0","1","0","1","0","0","1","1","1","0","4"]
    const q=JSON.parse(data2.historySecurity);
    // const q=data2.historySecurity;
    // console.log("q  is     "   +  q)
    let subject;
    let textEmail;

    if (language==="English") {
      textEmail= "Dear  " + capitalised + ", \nJson security assessment attached";
      subject="The Security Assessment JSON file " + companyName.toUpperCase();
    }

    if (language==="Portugese") {
      textEmail= "Prezado " + capitalised + ", \nAvaliação de segurança Json anexada";
      subject="O arquivo JSON de avaliação de segurança"+ companyName.toUpperCase();
    }


    let question_answers;
    question_answers=table0["rows"];
    // console.log("question_answers is     "   +  question_answers)


    const dict = {};
    for (const value of question_answers) {
      dict[value[0]]=value[1];
      // console.log("values    " + value[0] + " : " + value[1] );
    }
    // The JSON.stringify() method converts a JavaScript object or value to a JSON string,
    const jsonString=JSON.stringify(dict);
    // console.log("jsonString " + jsonString);
    // console.log ("tempFilePath  " +  tempFilePath)
    //* ******************************************************************************************************************

    // Stream contents to a file
    // const fs = require('fs')

    // Write a string to another file and set the file mode to 0755
    try {
      fs.writeFileSync(tempFilePath, jsonString); // , { mode: 0o755 }
    } catch (err) {
      // An error occurred
      console.error(err);
    }
    console.log("about to return");
    return [jsonString, tempFilePath, textEmail, subject];
  })
      .then(
          (jt)=>{
            console.log("Entering the mailing section " +jt);
            console.log(" jsonString after entering mailing " +jt[0]);

            const jsonString=jt[0];
            tempFilePath=jt[1];


            const textEmail=jt[2];
            console.log("textEmail" +textEmail);

            const subject=jt[3];
            console.log("subject" +subject);
            /* const nodemailer = require('nodemailer');
  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });
  */
            const nodemailer = require("nodemailer");
            const mailTransport = nodemailer.createTransport({
              host: "mail169.extendcp.co.uk",
              port: 465,
              secure: true,
              auth: {
                user: gmailEmail,
                pass: gmailPassword,
              },
            });
            const mailOptions = {
              from: gmailEmail,
              to: receiverID, // receiver
              cc: "ilesh.dattani@assentian.com",
              // 'johnbighamgm@gmail.com, ilesh.dattani@assentian.com'
              bcc: ccID,
              attachments: [{
                path: tempFilePath,
              }],
            };
            mailOptions.subject = subject;
            mailOptions.text =textEmail;
            mailTransport.sendMail(mailOptions, (error, info)=>{
              if (error) {
                return console.log("send mail error  ", error);
              } else {
                console.log("will now delete temp file");

                // console.log('about to unlink file')
                // could use fs.unlinkSync(tempFilePath)


                fs.unlink(tempFilePath, (err) => {
                  if (err) {
                    console.log("Failed to delete temp file:"+err);
                  } else {
                    console.log("Successfully deleted temp file");
                  }
                  // return null;
                }); // unlink
                return console.log("Email sent  "+ info.response);
              }
            }); // sendmail


            return jsonstring;
          })

      .catch((err)=> {
        console.log("Error   " + err);
      });

  return null;
}


/*
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(`Got the final result: ${finalResult}`);
})
.catch(failureCallback);


    const mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    });

const mailOptions = {
      from: gmailEmail,
      to: receiverID,  //receiver
      cc: 'ilesh.dattani@assentian.com',
       //'johnbighamgm@gmail.com, ilesh.dattani@assentian.com'
      bcc:ccID,
      attachments: [{
             path: tempFilePath
         }]
     };
 mailOptions.subject = subject
 mailOptions.text =textEmail
mailTransport.sendMail(mailOptions, (error,info)=>{
  if(error)
      { return console.log('send mail error  ', error)}
    else
      {console.log("will now delete temp file");
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

*/
/*
  fs.writeFile(tempFilePath, jsonString, err => {
    if (err) {
          console.log('Error writing file', err)
              }
        else
        {
        console.log('Successfully written to file')
        mailTransport.sendMail(mailOptions, (error,info)=>{
            if(error)
                { return console.log('send mail error  ', error)}
              else
                {console.log("will now delete temp file");
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
      return null;
    })
*/


