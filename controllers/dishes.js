const { User, Dish, Meal, User_Dish } = require('../models');
const { validationResult } = require('express-validator');
const sequelize = require('sequelize');
// const paginate = require('jw-paginate');

module.exports.index = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
        return res.status(422).json({
            errors: extractedErrors
        });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }

    const offset = parseInt(req.query.page) * parseInt(req.query.size) || 0;
    const limit = parseInt(req.query.size) || 7;

    const getDishes = await User_Dish.findAll({
        attributes: ['UserId', 'DishId'],
        where: { UserId: user.id },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Dish,
                attributes: ['id', 'name']
            }
        ],
        offset,
        limit
    });

    const dishes = [];
    if (getDishes) {
        for (let dish of getDishes) {
            dishes.push(dish.dataValues.Dish);
        }
    }

    res.status(200).json(dishes);
};

module.exports.all = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }

    const getDishes = await User_Dish.findAll({
        attributes: ['UserId', 'DishId'],
        where: { UserId: user.id },
        order: [['updatedAt', 'DESC']],
        include: [
            {
                model: Dish,
                attributes: ['id', 'name']
            }
        ]
    });

    const dishes = [];
    if (getDishes) {
        for (let dish of getDishes) {
            dishes.push(dish.dataValues.Dish);
        }
    }
    res.status(200).json({ dishes });
};

module.exports.destroy = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
        return res.status(422).json({
            errors: extractedErrors
        });
    }

    let dish = await Dish.findByPk(req.params.id);
    if (!dish) {
        return res.status(404).json({
            errors: {
                dish: req.t('error.notfound')
            }
        });
    }

    const user = await User.findByPk(req.user.id);

    const userHasDish = await User_Dish.findOne({
        where: { UserId: user.id, DishId: dish.id }
    });

    if (!userHasDish) {
        return res.status(403).json({
            errors: {
                dish: req.t('belongsto', { owner: req.t('user.user') })
            }
        });
    }

    const usersHasDish = await User_Dish.findAll({
        where: { DishId: dish.id }
    });

    if (usersHasDish.length > 1) {
        await User_Dish.destroy({
            where: { DishId: dish.id, UserId: user.id }
        });
    } else {
        if (usersHasDish[0].dataValues.UserId === user.id) {
            await User_Dish.destroy({
                where: { DishId: dish.id, UserId: user.id }
            });
            await Dish.destroy({ where: { id: dish.id } });
        }
    }

    res.status(200).json({
        message: req.t('deleted', { what: req.t('dish.dish') })
    });
};

module.exports.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
        return res.status(422).json({
            errors: extractedErrors
        });
    }

    let dish = await Dish.findByPk(req.body.dish.id);

    if (!dish) {
        res.status(404).json({
            errors: {
                dish: req.t('error.notfound')
            }
        });
    }

    const user = await User.findByPk(req.user.id);

    const usersHasDish = await User_Dish.findAll({
        where: { DishId: dish.id }
    });

    if (usersHasDish.length > 1) {
        let newDish = await Dish.create({
            name: req.body.dish.name.toLowerCase()
        });
        await User_Dish.findOrCreate({
            where: { UserId: user.id, DishId: newDish.id }
        });
        await User_Dish.destroy({
            where: { DishId: dish.id, UserId: user.id }
        });
        res.status(200).json({ newDish });
    } else {
        if (usersHasDish[0].dataValues.UserId === user.id) {
            const name = req.body.dish.name
                ? req.body.dish.name.toLowerCase()
                : dish.name;
            const updatedDish = await dish.update({ name });
            res.status(200).json({ updatedDish });
        }
    }
};

module.exports.top = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
        return res.status(422).json({
            errors: extractedErrors
        });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }

    const limit = parseInt(req.query.limit) || 10;

    const getDishes = await Meal.findAll({
        attributes: [[sequelize.fn('count', sequelize.col('DishId')), 'count']],
        group: ['Dish.id'],
        where: { UserId: user.id },
        include: [
            {
                model: Dish,
                attributes: ['id', 'name']
            }
        ],
        order: [[sequelize.literal('count'), 'DESC']],
        limit
    });

    const dishes = [];
    if (getDishes) {
        for (let dish of getDishes) {
            dishes.push(dish.dataValues);
        }
    }

    // console.table(dishes);

    res.status(200).json({ dishes });
};

module.exports.menu = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }

    const getDishes = await User_Dish.findAll({
        attributes: [],
        where: { UserId: user.id },
        include: [
            {
                model: Dish,
                attributes: ['name']
            }
        ],
        order: [
            [
                process.env.DB_DIALECT == 'postgres'
                    ? sequelize.literal('random()')
                    : sequelize.literal('rand()'),
                'DESC'
            ]
        ],
        limit: 7
    });

    const dishes = [];
    if (getDishes) {
        for (let dish of getDishes) {
            dishes.push(dish.dataValues);
        }
    }

    res.status(200).json({ dishes });
};

module.exports.suggest = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }

    const getDish = await User_Dish.findOne({
        attributes: [],
        where: { UserId: user.id },
        include: [
            {
                model: Dish,
                attributes: ['name']
            }
        ],
        order: [
            [
                process.env.DB_DIALECT == 'postgres'
                    ? sequelize.literal('random()')
                    : sequelize.literal('rand()'),
                'DESC'
            ]
        ]
    });

    const dish = getDish.dataValues.Dish;

    res.status(200).json({ dish });
};
