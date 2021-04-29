const express = require('express'), path = require('path');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const mysql = require('mysql');

const db = mysql.createConnection( 
    {
        host: 'remotemysql.com',
        user: '8tttXb5VZx',
        password: 'I7W2CAugk4',
        database: '8tttXb5VZx'
    }
)


// const db = mysql.createConnection( 
//     {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'office-database'
//     }
// )

app.use( cors() );
app.use( express.json() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( fileUpload() );


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var fullTime = null;

setInterval( () => {

    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var fullTimes = hours + ':' + minutes + ' ' + ampm;
    fullTime = fullTimes.toString();

}, 1 * 1000 );

app.post( '/medicalexaminationentry', ( req, res ) => {

    const { Token, height, weight, bmi, bp1, bp2, pulse, pr, unaidedDistantRtEye, unaidedDistantLtEye, aidedDistantRtEye, aidedDistantLtEye, unaidedNearRtEye, unaidedNearLtEye, aidedNearRtEye, aidedNearLtEye, colorVision, RightEar, LeftEar, Insertor }= req.body;

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    db.query(
        "SELECT candidate_id from candidate_tokens WHERE token_no = " + Token,
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                if( rslt[0].candidate_id != undefined )
                {

                    db.query(
                        "INSERT INTO medical_e_1(candidate_id, height, weight, body_mass_index, blood_pressure, pulse, pr, unaided_distant_rt_eye, unaided_distant_lt_eye, aided_distant_rt_eye, aided_distant_lt_eye, unaided_near_rt_eye, unaided_near_lt_eye, aided_near_rt_eye, aided_near_lt_eye, color_vision, right_ear, left_ear, insert_by, insert_date, insert_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        [ rslt[0].candidate_id, height, weight, bmi, bp1 + " / " + bp2, pulse, pr, unaidedDistantRtEye, unaidedDistantLtEye, aidedDistantRtEye, aidedDistantLtEye, unaidedNearRtEye, unaidedNearLtEye, aidedNearRtEye, aidedNearLtEye, colorVision, RightEar, LeftEar, Insertor, date, fullTime ],
                        ( err, rslt ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                
                            }else
                            {
                
                                res.send("Medical Exam1 Success");
                
                            }
                
                        }
                    )

                }else
                {

                    res.send( "Candidate Data Not Found" );

                }

            }

        }
    )

} )

app.post( '/medicalexamination2entry', ( req, res ) => {

    const { Token, generalAppearance, cardioVascular, respiratory, ent, Abdomen, hernia, hydrocele, exremities, back, skin, cns, deformities, speech, behaviour, orientation, memory, concentration, mood, thoughts, others, inserter }= req.body;

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    db.query(
        "SELECT candidate_id from candidate_tokens WHERE token_no = " + Token,
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                if( rslt[0].candidate_id != undefined )
                {

                    db.query(
                        "INSERT INTO medical_e_2(candidate_id, general_appearance, cardio_vascular, respiratory, ent, Abdomen, hernia, hydrocele, exremities, back, skin, cns, deformities, speech, behaviour, orientation, memory, concentration, mood, thoughts, others, insert_by, insert_date, insert_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        [ rslt[0].candidate_id, generalAppearance, cardioVascular, respiratory, ent, Abdomen, hernia, hydrocele, exremities, back, skin, cns, deformities, speech, behaviour, orientation, memory, concentration, mood, thoughts, others, inserter, date, fullTime ],
                        ( err, rslt ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                
                            }else
                            {
                
                                res.send("Medical Exam2 Success");
                
                            }
                
                        }
                    )

                }else
                {

                    res.send( "Candidate Data Not Found" );

                }

            }

        }
    )

} )

app.post('/setcandidate', (req, res) => {
    const { Name, Age, Nationality, Gander, MStatus, Profession, Passport, Insertor, ImageName, placeofissue, travellingto, token } = req.body;
    const Image = req.files.Image;
    let imagesNames = ImageName + '.png';

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    Image.mv('images/' + imagesNames , ( err ) => {

        if(err) {

            console.log(err);

        }

    });
    
    db.query(
        'INSERT INTO candidate_info(candidate_name,candidate_passport,candidate_age,candidate_nationality,candidate_gender,candidate_marital_status,candidate_profession, insert_by, insert_date, inserted_time, place_of_issue, travelling_to ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
        [Name,Passport,Age,Nationality,Gander,MStatus,Profession,Insertor,date,fullTime,placeofissue,travellingto],
        ( err, rslt ) => {

            if( !err )
            {

                db.query(
                    'SELECT candidate_id from candidate_info WHERE candidate_passport ='+ Passport,
                    ( err, rslt ) => {
    
                        if( err )
                        {
    
                            console.log( err );
    
                        }else
                        {
    
                            db.query(
                                'INSERT INTO candidate_images(candidate_id, candidate_image) VALUES(?,?)',
                                [ rslt[0].candidate_id, imagesNames ],
                                ( err, rsltt ) => {
    
                                    if( err )
                                    {
    
                                        console.log( err );
    
                                    }else
                                    {

                                        let tokenDate = new Date();
                                        let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();
    
                                        db.query(
                                            'INSERT INTO candidate_tokens(candidate_id, token_no, token_date, token_time) VALUES (?,?,?,?)',
                                            [ rslt[0].candidate_id, token, date, fullTime ],
                                            ( err, rslt ) => {

                                                if( err )
                                                {

                                                    console.log( err );

                                                }else
                                                {

                                                    res.send('Data inserted successfully');

                                                }

                                            }
                                        )
    
                                    }
    
                                }
                            )
    
                        }
    
                    }
                )

            }else
            {

                console.log( err );

            }

        }
    );

});

app.post( '/getcandidatethroughpassport', ( req, res ) => {

    const { passport } = req.body;

    db.query(
        "SELECT * from candidate_info WHERE candidate_passport = '" + passport + "'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }
            else
            {

                res.send( rslt );

            }

        }
    )

} )

app.post( '/gettokendata', ( req, res ) => {

    const { token } = req.body;

    db.query(
        "SELECT candidate_id from candidate_tokens WHERE token_no = '" + token + "'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }
            else
            {

                if( rslt[0] != undefined )
                {

                    db.query(
                        'SELECT * from candidate_info WHERE candidate_id = ' + rslt[0].candidate_id,
                        ( err, rslt ) => {
    
                            if( err )
                            {
    
                                console.log( err );
    
                            }else
                            {
    
                                res.send( rslt );
    
                            }
    
                        }
                    )

                }else
                {

                    res.send( "Not Found" );

                }

            }

        }
    )

} )

app.post('/getcandidatethroughid', ( req, res ) => {

    db.query(
        "SELECT * FROM candidate_info WHERE candidate_id = " + req.body.CandidateID,
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                res.send( rslt );

            }

        }
    )

} );

app.get('/getuser', ( req, res ) => {

    db.query(
        'SELECT * FROM users',
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                res.send( rslt );

            }

        }
    )

} );

app.post('/createuser', (req, res) => {
    const loginID = req.body.loginID;
    const loginPass = req.body.loginPass;
    const params = req.body.params;
    
    db.query(
        'INSERT INTO users(login_id,params,user_password) VALUES(?,?,?)',
        [loginID,params,loginPass],
        ( err, rslt ) => {

            if(err)
            {

                console.log( err );

            }else
            {

                res.send( "User Has Been Created" );

            }

        }
    );

});

app.post( '/getdatathroughdate', ( req, res ) => {

    const { date } = req.body;
    db.query(
        "SELECT * FROM candidate_info WHERE insert_date LIKE '%" + date + "%'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                // console.log( "SELECT * FROM candidate_info WHERE insert_date LIKE '%" + date + "%'" );
                res.send( rslt );

            }

        }
    )

} )

app.post( '/getcandidatethroughtime', ( req, res ) => {

    const { shift } = req.body;
    let q = null;

    if( shift == "DayShift" )
    {

        q = "SELECT * FROM candidate_info WHERE inserted_time LIKE '%am'";

    }else
    {

        q = "SELECT * FROM candidate_info WHERE inserted_time LIKE '%pm'";

    }

    db.query(
        q,
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                res.send( rslt );

            }

        }
    )

} )

app.listen( 3001, () => {

    console.log("Server Has Been Started");

} );