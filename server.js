const express = require('express'), path = require('path');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const mysql = require('mysql');
const { send } = require('process');

const PORT = process.env.PORT || 5000;

// for connect to database uploaded online

const db = mysql.createConnection( 
    {
        host: 'remotemysql.com',
        user: '8tttXb5VZx',
        password: 'I7W2CAugk4',
        database: '8tttXb5VZx'
    }
)

// for connect to local database

// const db = mysql.createConnection( 
//     {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'office-database'
//     }
// )

// defferent express packages other things

app.use( cors() );
app.use( express.json() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( fileUpload() );

// Here we provide access and allow origin to accept http-request

app.use(( req, res, next ) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();

});

// here is an array in which all month names are stored with whcich we can store month name into database

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// with the help of following block of code we can get the current time in am/pm

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

// the following request is to get all tokens from the database

app.post( '/getalltokens', ( req, res ) => {

    const { counter } = req.body;

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    db.query(
        "SELECT * FROM tokens WHERE tokens.token_status = 'initialized' OR tokens.token_status = 'at counter with user " + counter + "' LIMIT 1",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {
                if( rslt[0] != undefined )
                {

                    db.query(
                        "UPDATE tokens SET tokens.token_status = 'at counter with user " + counter + "' WHERE tokens.token = '" + rslt[0].token + "'",
                        ( err, rslts ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                
                            }else
                            {
                                
                                res.send(rslt[0]);
                
                            }
                
                        }
                    )
                }else
                {
                    res.send("No Record Found");
                }

            }

        }
    )

} )

// the following request is to get a particular token from the database

app.post( '/gettoken', ( req, res ) => {

    const { token }= req.body;

    db.query(
        "SELECT * FROM tokens WHERE token = '" + token + "'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                res.send(rslt);

            }

        }
    )

} )

// the following request is to store token into database when user click on 'get token' button

app.post( '/storetoken', ( req, res ) => {

    const { token, time }= req.body;

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    db.query(
        "INSERT INTO tokens(token, token_status, token_time, token_date) VALUES(?,?,?,?)",
        [ token, 'initialized', time, date ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                res.send("Success");

            }

        }
    )

} )

// the following request is to store the data of first examination into the database

app.post( '/exam1', ( req, res ) => {

    const { Token, height, weight, bmi, bp1, bp2, pulse, pr, unaidedDistantRtEye, unaidedDistantLtEye, aidedDistantRtEye, aidedDistantLtEye, unaidedNearRtEye, unaidedNearLtEye, aidedNearRtEye, aidedNearLtEye, colorVision, RightEar, LeftEar, Insertor }= req.body;

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    db.query(
        "SELECT candidate_id from candidate_tokens WHERE token_no = '" + Token + "'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                db.query(
                    "INSERT INTO medical_e_1(candidate_id, height, weight, body_mass_index, blood_pressure, pulse, pr, unaided_distant_rt_eye, unaided_distant_lt_eye, aided_distant_rt_eye, aided_distant_lt_eye, unaided_near_rt_eye, unaided_near_lt_eye, aided_near_rt_eye, aided_near_lt_eye, color_vision, right_ear, left_ear, insert_by, insert_date, insert_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [rslt[0].candidate_id, height, weight, bmi, bp1 + " / " + bp2, pulse, pr, unaidedDistantRtEye, unaidedDistantLtEye, aidedDistantRtEye, aidedDistantLtEye, unaidedNearRtEye, unaidedNearLtEye, aidedNearRtEye, aidedNearLtEye, colorVision, RightEar, LeftEar, Insertor, date, fullTime],
                    (err, rslt) => {

                        if (err) {

                            console.log(err);

                        } else {

                            res.send("Medical Exam1 Success");

                        }

                    }
                )

            }

        }
    )

} )

// the following request is to store the data of second examination into the database

app.post( '/medicalexamination2entry', ( req, res ) => {

    const { Token, generalAppearance, cardioVascular, respiratory, ent, Abdomen, hernia, hydrocele, exremities, back, skin, cns, deformities, speech, behaviour, orientation, memory, concentration, mood, thoughts, others, inserter }= req.body;

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    db.query(
        "SELECT candidate_id from candidate_tokens WHERE token_no = '" + Token + "'",
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

// the following request is to store the data from the candidate when he/she filled her/him form by himself/herself, into the database

app.post('/databycandidate', (req, res) => {
    const { Name, Age, Nationality, Gander, MStatus, Profession, Passport, ImageName, placeofissue, travellingto, token } = req.body;
    const Image = req.files.Image;
    let imagesNames = ImageName + '.png';

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    Image.mv('client/public/images/candidates/' + imagesNames , ( err ) => {

        if(err) {

            console.log(err);

        }

    });
    
    db.query(
        'INSERT INTO candidate_info(candidate_name,candidate_passport,candidate_age,candidate_nationality,candidate_gender,candidate_marital_status,candidate_profession, insert_date, inserted_time, place_of_issue, travelling_to ) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
        [Name,Passport,Age,Nationality,Gander,MStatus,Profession,date,fullTime,placeofissue,travellingto],
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

// the following request is to store the data of candidate filled by a user from counter, into the database

app.post('/setcandidate', (req, res) => {
    const { filled } = req.body;
    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();
    if( filled === 'notfilled' )
    {
        const { Name, Age, Nationality, Gander, MStatus, Profession, Passport, Insertor, ImageName, placeofissue, travellingto, token } = req.body;
        const Image = req.files.Image;
        let imagesNames = ImageName + '.png';

        Image.mv('client/public/images/candidates/' + imagesNames, (err) => {

            if (err) {

                console.log(err);

            }

        });

        db.query(
            'INSERT INTO candidate_info(candidate_name,candidate_passport,candidate_age,candidate_nationality,candidate_gender,candidate_marital_status,candidate_profession, insert_by, insert_date, inserted_time, place_of_issue, travelling_to ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
            [Name, Passport, Age, Nationality, Gander, MStatus, Profession, Insertor, date, fullTime, placeofissue, travellingto],
            (err, rslt) => {

                if (!err) {

                    db.query(
                        'SELECT candidate_id from candidate_info WHERE candidate_passport =' + Passport,
                        (err, rslt) => {

                            if (err) {

                                console.log(err);

                            } else {

                                db.query(
                                    'INSERT INTO candidate_images(candidate_id, candidate_image) VALUES(?,?)',
                                    [rslt[0].candidate_id, imagesNames],
                                    (err, rsltt) => {

                                        if (err) {

                                            console.log(err);

                                        } else {

                                            let tokenDate = new Date();
                                            let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

                                            db.query(
                                                'INSERT INTO candidate_tokens(candidate_id, token_no, token_status, token_date, token_time) VALUES (?,?,?,?,?)',
                                                [rslt[0].candidate_id, token, 'encountered', date, fullTime],
                                                (err, rslt) => {

                                                    if (err) {

                                                        console.log(err);

                                                    } else {

                                                        db.query(
                                                            "UPDATE tokens SET tokens.token_status = 'encountered' WHERE tokens.token = '" + token + "'",
                                                            ( err, rslt ) => {
                                
                                                                if( err )
                                                                {
                                                                    console.log( err );
                                                                }else
                                                                {
                                
                                                                    res.send('Data Inserted Successfully');
                                
                                                                }
                                
                                                            }
                                                        )

                                                    }

                                                }
                                            )

                                        }

                                    }
                                )

                            }

                        }
                    )

                } else {

                    console.log(err);

                }

            }
        );
    }else
    {

        const { id, Name, Age, Nationality, Gander, MStatus, Profession, Passport, Insertor, Editor, ImageName, placeofissue, travellingto, token, ImageNotImg } = req.body;
        if( ImageName.length == 9 )
        {
            const Image = req.files.Image;
            let imagesNames = ImageName + '.png';

            Image.mv('client/public/images/candidates/' + imagesNames, (err) => {

                if (err) {

                    console.log(err);

                }

            });

            db.query(
                "UPDATE candidate_info SET candidate_name = '" + Name + "', candidate_passport = '" + Passport + "', candidate_age = '" + Age + "', candidate_nationality = '" + Nationality + "', candidate_marital_status = '" + MStatus + "', candidate_profession = '" + Profession + "', place_of_issue = '" + placeofissue + "', travelling_to = '" + travellingto + "', insert_by = '" + Insertor + "', insert_date = '" + date + "', inserted_time = '" + fullTime + "', edit_by = '" + Editor + "', edit_date = '" + date + "', edited_time = '" + fullTime + "' WHERE candidate_id = " + id,
                (err, rslt) => {

                    if (!err) {

                        db.query(
                            "UPDATE tokens SET tokens.token_status = 'encountered' WHERE tokens.token = '" + token + "'",
                            ( err, rslt ) => {

                                if( err )
                                {
                                    console.log( err );
                                }else
                                {

                                    db.query(
                                        "UPDATE candidate_tokens SET token_status = 'encountered' WHERE token_no = '" + token + "'",
                                        ( err, rslt ) => {
            
                                            if( err )
                                            {
                                                console.log( err );
                                            }else
                                            {
            
                                                db.query(
                                                    "UPDATE candidate_images SET candidate_image = '" + imagesNames + "' WHERE candidate_id = '" + id + "'",
                                                    ( err, rslt ) => {
                        
                                                        if( err )
                                                        {
                                                            console.log( err );
                                                        }else
                                                        {
                        
                                                            res.send('Data Updated Successfully');
                        
                                                        }
                        
                                                    }
                                                )
            
                                            }
            
                                        }
                                    )

                                }

                            }
                        )

                    } else {

                        console.log(err);

                    }

                }
            );

        }else if( ImageName.endsWith('.png') )
        {

            db.query(
                "UPDATE candidate_info SET candidate_name = '" + Name + "', candidate_passport = '" + Passport + "', candidate_age = '" + Age + "', candidate_nationality = '" + Nationality + "', candidate_marital_status = '" + MStatus + "', candidate_profession = '" + Profession + "', place_of_issue = '" + placeofissue + "', travelling_to = '" + travellingto + "', insert_by = '" + Insertor + "', insert_date = '" + date + "', inserted_time = '" + fullTime + "', edit_by = '" + Editor + "', edit_date = '" + date + "', edited_time = '" + fullTime + "' WHERE candidate_id = " + id,
                (err, rslt) => {

                    if (!err) {

                        db.query(
                            "UPDATE tokens SET tokens.token_status = 'encountered' WHERE tokens.token = '" + token + "'",
                            ( err, rslt ) => {

                                if( err )
                                {
                                    console.log( err );
                                }else
                                {

                                    db.query(
                                        "UPDATE candidate_tokens SET token_status = 'encountered' WHERE token_no = '" + token + "'",
                                        ( err, rslt ) => {
            
                                            if( err )
                                            {
                                                console.log( err );
                                            }else
                                            {
            
                                                res.send('Data Updated Successfully');
            
                                            }
            
                                        }
                                    )

                                }

                            }
                        )

                    } else {

                        console.log(err);

                    }

                }
            );

        }else
        {

            const Image = req.files.Image;
            let imagesNames = ImageName + '.png';

            Image.mv('client/public/images/candidates/' + imagesNames, (err) => {

                if (err) {

                    console.log(err);

                }

            });

            db.query(
                "UPDATE candidate_info SET candidate_name = '" + Name + "', candidate_passport = '" + Passport + "', candidate_age = '" + Age + "', candidate_nationality = '" + Nationality + "', candidate_marital_status = '" + MStatus + "', candidate_profession = '" + Profession + "', place_of_issue = '" + placeofissue + "', travelling_to = '" + travellingto + "', insert_by = '" + Insertor + "', insert_date = '" + date + "', inserted_time = '" + fullTime + "', edit_by = '" + Editor + "', edit_date = '" + date + "', edited_time = '" + fullTime + "' WHERE candidate_id = " + id,
                (err, rslt) => {

                    if (!err) {

                        db.query(
                            "UPDATE tokens SET tokens.token_status = 'encountered' WHERE tokens.token = '" + token + "'",
                            ( err, rslt ) => {

                                if( err )
                                {
                                    console.log( err );
                                }else
                                {

                                    db.query(
                                        "UPDATE candidate_tokens SET token_status = 'encountered' WHERE token_no = '" + token + "'",
                                        ( err, rslt ) => {
            
                                            if( err )
                                            {
                                                console.log( err );
                                            }else
                                            {
            
                                                db.query(
                                                    "UPDATE tokens SET candidate_images.candidate_image = '" + imagesNames + "' WHERE candidate_images.candidate_id = '" + id + "'",
                                                    ( err, rslt ) => {
                        
                                                        if( err )
                                                        {
                                                            console.log( err );
                                                        }else
                                                        {
                        
                                                            res.send('Data Updated Successfully');
                        
                                                        }
                        
                                                    }
                                                )
            
                                            }
            
                                        }
                                    )

                                }

                            }
                        )

                    } else {

                        console.log(err);

                    }

                }
            );

        }

    }

});

// the following request is to start process of the day & it will delete all tokens generated yesterday

app.get( '/startprocess', ( req, res ) => {

    db.query(
        "DELETE FROM tokens",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }
            else
            {

                res.send(rslt);

            }

        }
    )

} )

// the following request is to get the data of candidate against the current token

app.post( '/getcurrentcandidate', ( req, res ) => {

    const { token, viewer } = req.body;

    db.query(
        "SELECT candidate_info.*, candidate_tokens.token_no, candidate_images.candidate_image FROM candidate_info INNER JOIN candidate_tokens ON candidate_info.candidate_id = candidate_tokens.candidate_id INNER JOIN candidate_images ON candidate_info.candidate_id = candidate_images.candidate_id WHERE candidate_tokens.token_no = '" + token + "'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }
            else
            {

                res.send(rslt);

            }

        }
    )

} )

// the following request is to get candidate data agains the given token

app.post( '/gettokendata', ( req, res ) => {

    const { token } = req.body;

    db.query(
        "SELECT candidate_info.*, users.*, candidate_images.candidate_image, candidate_tokens.token_no from candidate_info INNER JOIN candidate_images ON candidate_info.candidate_id = candidate_images.candidate_id INNER JOIN candidate_tokens ON candidate_info.candidate_id = candidate_tokens.candidate_id INNER JOIN users ON users.login_id = candidate_info.insert_by WHERE candidate_tokens.token_no = '" + token + "'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }
            else
            {

                res.send(rslt);

            }

        }
    )

} )

// the following request is to get all users data

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

// the following request is to create a new user ( For Admin Only )

app.post('/createuser', (req, res) => {
    const { LoginID, Password, Params, Role, ImageName } = req.body;
    const Img = req.files.Image;
    let ImgWithExtension = ImageName + '.png';

    Img.mv('client/public/images/users/' + ImgWithExtension , ( err ) => {

        if(err) {

            console.log(err);

        }

    });
    
    db.query(
        'INSERT INTO users(login_id,params,user_password,user_role,user_image) VALUES(?,?,?,?,?)',
        [LoginID,Params,Password,Role,ImgWithExtension],
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

// the following request is to get all candidate data according to the given date

app.post( '/getdatathroughdate', ( req, res ) => {

    const { date } = req.body;

    db.query(
        "SELECT candidate_info.*, users.*, candidate_images.candidate_image from candidate_info INNER JOIN candidate_images ON candidate_info.candidate_id = candidate_images.candidate_id INNER JOIN users ON candidate_info.insert_by = users.login_id WHERE insert_date LIKE '%" + date + "%'",
        (err, rslt) => {

            if (err) {

                console.log(err);

            } else {

                res.send( rslt );

            }
        }
    )

} )

// the following request is to get all candidate data according to the given time

app.post( '/getcandidatethroughtime', ( req, res ) => {

    const { time1, time2 } = req.body;

    db.query(
        "SELECT candidate_info.*, users.*, candidate_images.candidate_image from candidate_info INNER JOIN candidate_images ON candidate_info.candidate_id = candidate_images.candidate_id INNER JOIN users ON candidate_info.insert_by = users.login_id WHERE candidate_info.inserted_time between '" + time1 + "' AND '" + time2 + "'",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else
            {

                // console.log(rslt);
                res.send( rslt );

            }

        }
    )

} )

// the following request is to store the data of laboratory tests

app.post('/laboratoryentry', ( req, res ) => {

    const { 
        bloodGroup, 
        hemoglobin, 
        malaria, 
        microFilaria, 
        RBs, 
        lft, 
        creatinine, 
        hivIII, 
        HbsAg, 
        antiHcv, 
        vdrl, 
        tpha, 
        sugar, 
        albumin, 
        CovidPCR, 
        CovidAntibodies, 
        helminthes, 
        ova, 
        cyst, 
        others, 

        Polio,
        PolioDate,
        MMR1,
        MMR1Date,
        MMR2,
        MMR2Date,
        Meningococcal,
        MeningococcalDate,
        Covid,
        Inserter,
        CovidDate,
        Token
    } = req.body;

    let tokenDate = new Date();
    let date = tokenDate.getFullYear() + '-' + monthNames[tokenDate.getMonth()] + '-' + tokenDate.getDate();

    db.query(
        "SELECT candidate_id from candidate_tokens WHERE token_no = '" + Token + "'",
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
                        "INSERT INTO polio_status(status, date, insert_by, insert_date, insert_time, candidate_id) VALUES (?,?,?,?,?,?)",
                        [Polio, PolioDate, Inserter, date, fullTime, rslt[0].candidate_id],
                        ( err, result ) => {
    
                            if( err )
                            {
    
                                console.log( err );
    
                            }else
                            {
    
                                db.query(
                                    "INSERT INTO mmr1_status(status, date, insert_by, insert_date, insert_time, candidate_id) VALUES (?,?,?,?,?,?)",
                                    [MMR1, MMR1Date, Inserter, date, fullTime, rslt[0].candidate_id],
                                    ( err, result ) => {
                
                                        if( err )
                                        {
                
                                            console.log( err );
                
                                        }else
                                        {
                
                                            db.query(
                                                "INSERT INTO mmr2_status(status, date, insert_by, insert_date, insert_time, candidate_id) VALUES (?,?,?,?,?,?)",
                                                [MMR2, MMR2Date, Inserter, date, fullTime, rslt[0].candidate_id],
                                                ( err, result ) => {
                            
                                                    if( err )
                                                    {
                            
                                                        console.log( err );
                            
                                                    }else
                                                    {
                            
                                                        db.query(
                                                            "INSERT INTO meningococcal_status(status, date, insert_by, insert_date, insert_time, candidate_id) VALUES (?,?,?,?,?,?)",
                                                            [Meningococcal, MeningococcalDate, Inserter, date, fullTime, rslt[0].candidate_id],
                                                            ( err, result ) => {
                                        
                                                                if( err )
                                                                {
                                        
                                                                    console.log( err );
                                        
                                                                }else
                                                                {
                                        
                                                                    db.query(
                                                                        "INSERT INTO covid_status(status, date, insert_by, insert_date, insert_time, candidate_id) VALUES (?,?,?,?,?,?)",
                                                                        [Covid, CovidDate, Inserter, date, fullTime, rslt[0].candidate_id],
                                                                        ( err, result ) => {
                                                    
                                                                            if( err )
                                                                            {
                                                    
                                                                                console.log( err );
                                                    
                                                                            }else
                                                                            {

                                                                                let ids = [];
                                                    
                                                                                db.query(
                                                                                    "SELECT id FROM polio_status WHERE candidate_id = " + rslt[0].candidate_id,
                                                                                    ( err, pid ) => {
                                                                
                                                                                        if( err )
                                                                                        {
                                                                
                                                                                            console.log( err );
                                                                
                                                                                        }else
                                                                                        {
                                                                
                                                                                            ids[0] = pid[0].id;
                                                                                            db.query(
                                                                                                "SELECT id FROM mmr1_status WHERE candidate_id = " + rslt[0].candidate_id,
                                                                                                ( err, m1id ) => {
                                                                            
                                                                                                    if( err )
                                                                                                    {
                                                                            
                                                                                                        console.log( err );
                                                                            
                                                                                                    }else
                                                                                                    {
                                                                            
                                                                                                        ids[1] = m1id[0].id;
                                                                                                        db.query(
                                                                                                            "SELECT id FROM mmr2_status WHERE candidate_id = " + rslt[0].candidate_id,
                                                                                                            ( err, m2id ) => {
                                                                                        
                                                                                                                if( err )
                                                                                                                {
                                                                                        
                                                                                                                    console.log( err );
                                                                                        
                                                                                                                }else
                                                                                                                {
                                                                                        
                                                                                                                    ids[2] = m2id[0].id;
                                                                                                                    db.query(
                                                                                                                        "SELECT id FROM meningococcal_status WHERE candidate_id = " + rslt[0].candidate_id,
                                                                                                                        ( err, megid ) => {
                                                                                                    
                                                                                                                            if( err )
                                                                                                                            {
                                                                                                    
                                                                                                                                console.log( err );
                                                                                                    
                                                                                                                            }else
                                                                                                                            {
                                                                                                    
                                                                                                                                ids[3] = megid[0].id;
                                                                                                                                db.query(
                                                                                                                                    "SELECT id FROM covid_status WHERE candidate_id = " + rslt[0].candidate_id,
                                                                                                                                    ( err, cvid ) => {
                                                                                                                
                                                                                                                                        if( err )
                                                                                                                                        {
                                                                                                                
                                                                                                                                            console.log( err );
                                                                                                                
                                                                                                                                        }else
                                                                                                                                        {
                                                                                                                
                                                                                                                                            ids[4] = cvid[0].id;
                                                                                                                                            db.query(
                                                                                                                                                "INSERT INTO vaccination(candidate_id, polio_status, mmr1_status, mmr2_status, meningococcal_status, covid_status, insert_by, insert_date, insert_time) VALUES(?,?,?,?,?,?,?,?,?)",
                                                                                                                                                [rslt[0].candidate_id, ids[0], ids[1], ids[2], ids[3], ids[4], Inserter, date, fullTime],
                                                                                                                                                ( err, result ) => {

                                                                                                                                                    if( err )
                                                                                                                                                    {

                                                                                                                                                        console.log( err );

                                                                                                                                                    }else
                                                                                                                                                    {

                                                                                                                                                        db.query(
                                                                                                                                                            "SELECT id FROM vaccination WHERE candidate_id = " + rslt[0].candidate_id,
                                                                                                                                                            ( err, result ) => {

                                                                                                                                                                if( err )
                                                                                                                                                                {

                                                                                                                                                                    console.log( err );

                                                                                                                                                                }else
                                                                                                                                                                {

                                                                                                                                                                    db.query(
                                                                                                                                                                        "INSERT INTO laboratory_investigation(candidate_id, blood_group, hemoglobin, malaria, micro_filaria, RBs, lft, creatinine, hivIII, HbsAg, antiHcv, vdrl, tpha, sugar, albumin, CovidPCR, CovidAntibodies, helminthes, ova, cyst, others, vaccination_id, insert_by, insert_date, insert_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                                                                                                                                                        [rslt[0].candidate_id, bloodGroup, hemoglobin, malaria, microFilaria, RBs, lft, creatinine, hivIII, HbsAg, antiHcv, vdrl, tpha, sugar, albumin, CovidPCR, CovidAntibodies, helminthes, ova, cyst, others, result[0].id, Inserter, date, fullTime],
                                                                                                                                                                        ( err, result ) => {
                        
                                                                                                                                                                            if( err )
                                                                                                                                                                            {
                        
                                                                                                                                                                                console.log( err );
                        
                                                                                                                                                                            }else
                                                                                                                                                                            {

                                                                                                                                                                                res.send('Data Inserted');
                                                                                                                                                                                
                                                                                                                                                                            }
                        
                                                                                                                                                                        }
                                                                                                                                                                    )

                                                                                                                                                                }

                                                                                                                                                            }
                                                                                                                                                        )

                                                                                                                                                    }

                                                                                                                                                }
                                                                                                                                            )
                                                                                                                
                                                                                                                                        }
                                                                                                                
                                                                                                                                    }
                                                                                                                                )
                                                                                                    
                                                                                                                            }
                                                                                                    
                                                                                                                        }
                                                                                                                    )
                                                                                        
                                                                                                                }
                                                                                        
                                                                                                            }
                                                                                                        )
                                                                            
                                                                                                    }
                                                                            
                                                                                                }
                                                                                            )
                                                                
                                                                                        }
                                                                
                                                                                    }
                                                                                )
                                                    
                                                                            }
                                                    
                                                                        }
                                                                    )
                                        
                                                                }
                                        
                                                            }
                                                        )
                            
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

                    res.send( "Not Found" );

                }

            }

        }
    )

} )

// the following condition is for heroku app

if ( process.env.NODE_ENV == "production")
{ 
    app.use(express.static("client/build"));
}

// the following block of code is to define the port number which is dynamic

app.listen( PORT, () => {

    console.log("Server Has Been Started");

} );