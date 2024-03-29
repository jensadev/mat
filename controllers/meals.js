const { Meal, User, Dish, User_Dish } = require('../models/');
const { validationResult } = require('express-validator');
// const paginate = require('jw-paginate');
const sequelize = require('sequelize');

// module.exports.index = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const extractedErrors = {};
//         errors
//             .array()
//             .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
//         return res.status(422).json({
//             errors: extractedErrors
//         });
//     }

//     const user = await User.findByPk(req.user.id);
//     if (!user) {
//         res.status(404).json({
//             errors: {
//                 user: req.t('error.notfound')
//             }
//         });
//     }

//     const getMeals = await Meal.findAll({
//         attributes: ['id', 'date', 'type'],
//         where: { UserId: user.id },
//         order: [
//             // ['date', 'DESC'],
//             [sequelize.fn('date', sequelize.col('date')), 'DESC'],
//             ['type', 'ASC']
//         ],
//         include: [
//             {
//                 model: Dish,
//                 attributes: ['name']
//             }
//         ]
//     });

//     const meals = [];
//     if (getMeals) {
//         for (let meal of getMeals) {
//             meals.push(meal.dataValues);
//         }
//     }
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = 7;
//     const maxPages = 5;
//     const pager = paginate(meals.length, page, pageSize, maxPages);
//     const pageOfItems = meals.slice(pager.startIndex, pager.endIndex + 1);

//     res.status(200).json({ pager, pageOfItems });
// };

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

    const getMeals = await Meal.findAll({
        attributes: ['id', 'date', 'type'],
        where: { UserId: user.id },
        order: [
            [sequelize.fn('date', sequelize.col('date')), 'DESC'],
            ['type', 'ASC'],
            ['id', 'DESC']
        ],
        include: [
            {
                model: Dish,
                attributes: ['name']
            }
        ],
        offset,
        limit
    });

    const meals = [];
    if (getMeals) {
        for (let meal of getMeals) {
            meals.push(meal.dataValues);
        }
    }

    res.status(200).json(meals);
};

module.exports.store = async (req, res) => {
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

    let dish = await Dish.findOrCreate({
        where: { name: req.body.meal.dish.toLowerCase() }
    });

    dish = !dish.id ? dish[0].dataValues : dish;

    console.log(dish);

    await User_Dish.findOrCreate({
        where: { UserId: user.id, DishId: dish.id }
    });

    let meal = await Meal.create({
        date: req.body.meal.date,
        UserId: user.id,
        DishId: dish.id,
        type: req.body.meal.type
    });

    res.status(201).json({ meal });
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

    let meal = await Meal.findByPk(req.params.id);
    if (!meal) {
        res.status(404).json({
            errors: {
                meal: req.t('error.notfound')
            }
        });
    }

    const user = await User.findByPk(req.user.id);
    if (user.id != meal.UserId) {
        res.status(403).json({
            errors: {
                meal: req.t('belongsto', { owner: req.t('user.user') })
            }
        });
    }

    await Meal.destroy({ where: { id: req.params.id } });
    res.status(200).json({
        message: req.t('deleted', { what: req.t('meal.meal') })
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

    let meal = await Meal.findByPk(req.body.meal.id);
    if (!meal) {
        res.status(404).json({
            errors: {
                meal: req.t('error.notfound')
            }
        });
    }
    const user = await User.findByPk(req.user.id);
    if (user.id != meal.UserId) {
        res.status(403).json({
            errors: {
                meal: req.t('belongsto', { owner: req.t('user.user') })
            }
        });
    }

    const [dish] = await Dish.findOrCreate({
        where: { name: req.body.meal.dish.toLowerCase() }
    });

    await User_Dish.findOrCreate({
        where: { UserId: user.id, DishId: dish.id }
    });

    const date = req.body.meal.date ? req.body.meal.date : meal.date;
    const type = parseInt(req.body.meal.type)
        ? parseInt(req.body.meal.type)
        : meal.type;
    const DishId = dish.id;
    const UserId = user.id;

    const updatedMeal = await meal.update({ date, type, DishId, UserId });
    res.status(200).json({ updatedMeal });
};
