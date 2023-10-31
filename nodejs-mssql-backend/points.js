const express = require('express');
const mssql = require('./db-driver')
const pool = require('./db');

const router = express.Router();

/**
 * @swagger
 * /api/points:
 *   get:
 *     summary: Get points
 *     description: Retrieve points.
 *     responses:
 *       200:
 *         description: Points retrieved successfully
 *       404:
 *         description: Points not found
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .query('SELECT TaskID, PersonID, Points FROM Points;');
        
		res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error ' });
    } finally {
        pool.close();
    }
});
/**
 * @swagger
 * /api/points:
 *   post:
 *     summary: Add points
 *     description: Add points to a person and task.
 *     parameters:
 *       - name: points
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             PersonID:
 *               type: integer
 *             TaskID:
 *               type: integer
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
        const { PersonID, TaskID } = req.body;
		
        await pool.connect();
		
		const person = await pool.request()
			.input('PersonId', mssql.Int, PersonID)
			.query('SELECT * FROM Persons WHERE PersonID = @PersonID;');
		
		if (person.recordset.length === 0){
            res.status(400).json({ message: 'Person not found' });
        }
		
		const task = await pool.request()
			.input('TaskId', mssql.Int, TaskID)
			.query('SELECT * FROM Tasks WHERE TaskID = @TaskID;');
		
		if (task.recordset.length === 0){
            res.status(400).json({ message: 'Task not found' });
        }
		
		if (task.recordset[0].Done == true){
            res.status(400).json({ message: 'Task has already been closed' });
        }

		const taskupdate = await pool.request()
			.input('TaskId', mssql.Int, TaskID)
			.query('UPDATE Tasks SET Done = 1 WHERE TaskID = @TaskID;');
			
		if (taskupdate.rowsAffected[0] === 0) {
            return res.status(500).json({ message: 'Task update failed' });
        }
		
        const result = await pool.request()
            .input('PersonID', mssql.Int, PersonID)
            .input('TaskID', mssql.Int, TaskID)
            .input('Points', mssql.Int, task.recordset[0].Point)
            .query('INSERT INTO Points (PersonID, TaskID, Points) VALUES (@PersonID, @TaskID, @Points);');
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
 * /api/points/person/{personId}:
 *   get:
 *     summary: Get points by PersonID
 *     description: Retrieve points for a specific person.
 *     parameters:
 *       - name: personId
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *         description: ID of the person to retrieve points for
 *     responses:
 *       200:
 *         description: Points retrieved successfully
 *       404:
 *         description: Points not found
 *       500:
 *         description: Internal server error
 */
router.get('/person/:personId', async (req, res) => {
    try {
        const personId = req.params.personId;
        await pool.connect();
        const result = await pool.request()
            .input('PersonID', mssql.Int, personId)
            .query('SELECT TaskID, Points FROM Points WHERE PersonID = @PersonID;');
        
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Points not found for the specified PersonID' });
        } else {
            res.status(200).json(result.recordset);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }
});

module.exports = router;
