const db = require('../db.js')
const Reservation = db.reservation;

exports.findAll = async (req, res) => {
    try {
        let reservations;

        // Si l'utilisateur est un admin ou un super_admin, récupérer toutes les réservations
        if (req.user.user_role === 'admin' || req.user.user_role === 'super_admin') {
            reservations = await Reservation.findAll();
        } else {
            // Sinon, récupérer uniquement les réservations créées par l'utilisateur actuel
            reservations = await Reservation.findAll({
                where: {
                    userId: req.user.id
                }
            });
        }

        res.send(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};


exports.create = (req, res) => {
    console.log('Req User:', req.user.id);
    const {
        number_of_customers,
        reservation_date,
        reservation_name,
        reservation_note
    } = req.body;

    const validations = {
        number_of_customers: 'number',
        reservation_date: 'string',
        reservation_name: 'string',
        reservation_note: 'string',
    };

    for (const [key, type] of Object.entries(validations)) {
        if (typeof req.body[key] !== type) {
            return res.status(422).json({ error: `${key} must be a ${type}` });
        }
    };

    Reservation.create({
        number_of_customers: number_of_customers,
        reservation_date: reservation_date,
        reservation_name: reservation_name,
        reservation_note: reservation_note,
        reservation_status: 1,
        userId: req.user.id, // supposant que l'utilisateur actuel est stocké dans req.user
     }).then(reservation => {
        res.send(reservation)
     });
};


exports.update = (req, res) => {
    const reservationId = req.params.id
    Reservation.update({
        number_of_customers: req.body.number_of_customers,
        reservation_date: req.body.reservation_date,
        reservation_name: req.body.reservation_name,
        reservation_note: req.body.reservation_note,
        reservation_status: 1,
    }, {
        where: {
            id: reservationId
        }
    }).then(() => {
        res.status(200).send({
            message: `Reservation updated for reservationID: ${reservationId}`
        });
    });
};

exports.delete = (req, res) => {
    const reservationId = req.params.id
    Reservation.destroy({
        where: {
            id: reservationId
        }
    }).then(() => {
        res.status(200).send({
            message: `Reservation deleted for reservationID: ${reservationId}`
        });
    });
};