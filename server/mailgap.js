var bcrypt = require('bcrypt'),
    db = require('./pghelper'),
    config = require('./config'),
    uuid = require('node-uuid'),
    Q = require('q'),
    validator = require('validator'),
    winston = require('winston'),
  invalidCredentials = 'Invalid email or password';

/**
 * Encrypt password with per-user salt
 * @param password
 * @param callback
 */
function encryptPassword(password, callback) {
    winston.info('encryptPassword');
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(password, salt, function (err, hash) {
            return callback(err, hash);
        });
    });
}

/**
 * Compare clear with hashed password
 * @param password
 * @param hash
 * @param callback
 */
function comparePassword(password, hash, callback) {
    winston.info('comparePassword');

    bcrypt.compare(password, hash, function (err, match) {
        if (err) {
            return callback(err);
        }
        return callback(null, match);
    });
}

/**
 * Create an access token
 * @param user
 * @returns {promise|*|Q.promise}
 */
function createAccessToken(user) {
    winston.info('createAccessToken');
    var token = uuid.v4(),
        deferred = Q.defer();
    
    db.query('INSERT INTO tokens (userId, externalUserId, token) VALUES ($1, $2, $3)', [user.id, user.externaluserid, token])
        .then(function() {
            deferred.resolve(token);
        })
        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

/**
 * Regular login with application credentials
 * @param req
 * @param res
 * @param next
 * @returns {*|ServerResponse}
 */
function mailgappformdetail(req, res, next) {
    winston.info('mailgappformdetail');

    var user = req.body;
    console.log('user email is'+user.email);
	winston.info('user email is'+user.email);
    db.query('SELECT * from salesforce.contact WHERE email=$1 LIMIT 1', [user.email],true, true)
        .then(function (mailgapformdata) {
        	console.log('mailgapp form data is'+JSON.stringify(mailgapformdata));
        	winston.info('mailgapp form data is'+JSON.stringify(mailgapformdata));
        	return res.send(JSON.stringify(mailgapformdata));
            
        })
        .catch(next);
};

/**
 * Logout user
 * @param req
 * @param res
 * @param next
 */
function logout(req, res, next) {
    winston.info('logout');
    var token = req.headers['authorization'];
    winston.info('Logout token:' + token);
    db.query('DELETE FROM tokens WHERE token = $1', [token])
        .then(function () {
            winston.info('Logout successful');
            res.send('OK');
        })
        .catch(next);
};

/**
 * Signup
 * @param req
 * @param res
 * @param next
 * @returns {*|ServerResponse}
 */
function mailgapp(req, res, next) {

    winston.info('mailgapform method called');
    console.log('mailgapform method called')

    var mailgapform = req.body;
	winston.info('mailgapform data is'+mailgapform);
	console.log('mailgapform data is'+mailgapform)
   /* if (!validator.isEmail(user.email)) {
        return res.send(400, "Invalid email address");
    }
    if (!validator.isLength(user.firstName, 1) || !validator.isAlphanumeric(user.firstName)) {
        return res.send(400, "First name must be at least one character");
    }
    if (!validator.isLength(user.lastName, 1) || !validator.isAlphanumeric(user.lastName)) {
        return res.send(400, "Last name must be at least one character");
    }
    if (!validator.isLength(user.password, 4)) {
        return res.send(400, "Password must be at least 4 characters");
    }
    */

        var deferred = Q.defer(),
        externalUserId = (+new Date()).toString(36); // TODO: more robust UID logic

     db.query('INSERT INTO salesforce.contact (MG_Date__c,FirstName,MailingStreet,MailingCity,MailingState,MailingPostalCode,MG_Name__c,OtherStreet,'+
			  'OtherCity,OtherState, OtherPostalCode, MG_Applicant_Name__c,MG_Applicant_Address__c,MG_Applicant_City__c,MG_Applicant_State__c,'+
			  'MG_Applicant_Zipcode__c,MG_Applicant_Phone__c,MG_IdentityProof1__c,MG_IdentityProof2__c,MG_Company_Name__c,MG_Business_Address__c,MG_Business_Address_City__c,'+
			  'MG_Business_Address_State__c,MG_Business_Address_Zip__c,MG_Business_TelephneNo__c,MG_Business_Type__c)'+ 
			  'VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)', 
			  [mailgapform.date,mailgapform.Name,mailgapform.deliveryaddress,mailgapform.deliverycity,mailgapform.deliverystate,mailgapform.deliveryzipcode,mailgapform.authorizedname,
			   mailgapform.authorizedaddress,mailgapform.authorizedcity,mailgapform.authorizedstate,mailgapform.authorizedzipcode,mailgapform.applicantname,mailgapform.applicantaddress,
			   mailgapform.applicantcity,mailgapform.applicantstate,mailgapform.applicantzipcode,mailgapform.applicanttelephone,
			   mailgapform.proofA,mailgapform.proofB,mailgapform.businessname,mailgapform.businessaddress,mailgapform.businesscity,mailgapform.businessstate,mailgapform.businesszipcode,mailgapform.businesstelephone,
			   mailgapform.businesstype
			  ],true)
			  .then(function (insertedData) {
            deferred.resolve(insertedData);
            console.log('data inserted success');
            return res.send('OK');
        })
        .catch(function(err) {
        	console.log('data inserted error'+err)
            deferred.reject(err);
        });
    return deferred.promise;
        
   
};

/**
 * Create a user
 * @param user
 * @param password
 * @returns {promise|*|Q.promise}
 */
function createUser(user, password) {

    var deferred = Q.defer(),
        externalUserId = (+new Date()).toString(36); // TODO: more robust UID logic

    db.query('INSERT INTO salesforce.contact (email, password__c, firstname, lastname, leadsource, loyaltyid__c, accountid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, firstName, lastName, email, loyaltyid__c as externalUserId',
        [user.email, password, user.firstName, user.lastName, 'Loyalty App', externalUserId, config.contactsAccountId], true)
        .then(function (insertedUser) {
            deferred.resolve(insertedUser);
        })
        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
};

/**
 * Validate authorization token
 * @param req
 * @param res
 * @param next
 * @returns {*|ServerResponse}
 */
function validateToken (req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        token = req.session['token']; // Allow token to be passed in session cookie
    }
    if (!token) {
        winston.info('No token provided');
        return res.send(401, 'Invalid token');
    }
    db.query('SELECT * FROM tokens WHERE token = $1', [token], true, true)
        .then(function (item) {
            if (!item) {
                winston.info('Invalid token');
                return res.send(401, 'Invalid token');
            }
            req.userId = item.userid;
            req.externalUserId = item.externaluserid;
            return next();
        })
        .catch(next);
};

exports.mailgappformdetail = mailgappformdetail;
exports.logout = logout;
exports.mailgapp = mailgapp;
exports.createUser = createUser;
exports.createAccessToken = createAccessToken;
exports.validateToken = validateToken;
