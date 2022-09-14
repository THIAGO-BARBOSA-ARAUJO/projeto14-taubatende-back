import db from "../database/db.js";
import Joi from "joi";
import bcrypt from "bcrypt";

const usersSchema = Joi.object({
    name: Joi.string().min(3).max(24).empty().required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

async function SignUp(req, res) {
    try {
        const search = await db.collection('users').find().toArray();
        for (let i = 0; i < search.length; i++) {
            if (search[i].name === req.body.name) {
                res.status(422).send('This name already exists');
                return;
            } else if (search[i].email === req.body.email) {
                res.status(422).send('This e-mail already exists');
                return;
            }
        };
        await usersSchema.validateAsync(req.body);
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        /* const avatar = "https://www.pikpng.com/pngl/m/16-168770_user-iconset-no-profile-picture-icon-circle-clipart.png";
        if (req.body.avatar !== '') {
            avatar = req.body.avatar;
        }; */
        const user = {
            name: req.body.name,
            avatar: req.body.avatar,
            email: req.body.email,
            password: hashPassword
        };
        db.collection('users').insertOne(user);
        //res.send(user);
        res.sendStatus(201);
    } catch (error) {
        res.status(422).send(error.details.map((detail) => detail.message));
    }
}

export { SignUp };