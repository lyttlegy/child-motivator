const express = require('express');
const mssql = require('./db-driver')
const pool = require('./db');

const router = express.Router();

/**
 * @swagger
 * /api/persons:
 *   get:
 *     summary: Get all persons
 *     description: Retrieve a list of all persons.
 *     responses:
 *       200:
 *         description: List of persons retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .query('SELECT * FROM Persons;');
        
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }
});
/**
 * @swagger
 * /api/persons/children:
 *   get:
 *     summary: Get all persons, whom are children
 *     description: Retrieve a list of all persons whom are children.
 *     responses:
 *       200:
 *         description: List of persons retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/children', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
			.query('SELECT * FROM Persons where Adult <> 1;');
        
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }
});


/**
 * @swagger
 * /api/persons/{personId}:
 *   get:
 *     summary: Get person by ID
 *     description: Retrieve a person by their ID.
 *     parameters:
 *       - name: personId
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *         description: ID of the person to retrieve
 *     responses:
 *       200:
 *         description: Person retrieved successfully
 *       404:
 *         description: Person not found
 *       500:
 *         description: Internal server error
 */
router.get('/:personId', async (req, res) => {
    try {
        const personId = req.params.personId;
        await pool.connect();
        const result = await pool.request()
            .input('PersonID', mssql.Int, personId)
            .query('SELECT * FROM Persons WHERE PersonID = @PersonID;');
        
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Person not found' });
        } else {
            res.status(200).json(result.recordset[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }

});

/**
 * @swagger
 * /api/persons:
 *   post:
 *     summary: Add a person
 *     description: Add a person
 *     parameters:
 *       - name: person
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             FirstName:
 *               type: string
 *             LastName:
 *               type: string
 *             Adult:
 *               type: boolean
 *     responses:
 *       201:
 *         description: Points added successfully
 *       400:
 *         description: Bad request - Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    try {
        const { FirstName, LastName, Adult } = req.body;

        if (!FirstName || !LastName) {
            return res.status(400).json({ message: 'First name and last name are required.' });
        }

        await pool.connect();
        const result = await pool.request()
            //.input('PersonID', mssql.Int, personId)
            .input('FirstName', mssql.NVarChar, FirstName)
            .input('LastName', mssql.NVarChar, LastName)
            .input('Adult', mssql.Bit, Adult)
            .query('INSERT INTO Persons (FirstName, LastName , Adult)  VALUES (@FirstName, @LastName, @Adult);');
			
		res.status(201).json({ message: 'Point added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }
});
/**
 * @swagger
 * /api/persons/{personId}:
 *   put:
 *     summary: Update person by ID
 *     description: Update a person by their ID.
 *     parameters:
 *       - name: personId
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *         description: ID of the person to update
 *       - name: person
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             FirstName:
 *               type: string
 *             LastName:
 *               type: string
 *     responses:
 *       200:
 *         description: Person updated successfully
 *       400:
 *         description: Bad request - Invalid input
 *       404:
 *         description: Person not found
 *       500:
 *         description: Internal server error
 */
router.put('/:personId', async (req, res) => {
    try {
        const personId = req.params.personId;
        const { FirstName, LastName } = req.body;

        if (!FirstName || !LastName) {
            return res.status(400).json({ message: 'First name and last name are required.' });
        }

        await pool.connect();
        const updateResult = await pool.request()
            .input('PersonID', mssql.Int, personId)
            .input('FirstName', mssql.NVarChar, FirstName)
            .input('LastName', mssql.NVarChar, LastName)
            .query('UPDATE Persons SET FirstName = @FirstName, LastName = @LastName WHERE PersonID = @PersonID;');

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Person not found' });
        }

        // Fetch the updated person and send it as the response
        const selectResult = await pool.request()
            .input('PersonID', mssql.Int, personId)
            .query('SELECT * FROM Persons WHERE PersonID = @PersonID;');

        res.status(200).json(selectResult.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }
});



module.exports = router;
