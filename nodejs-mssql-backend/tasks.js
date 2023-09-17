const express = require('express');
const mssql = require('./db-driver')
const pool = require('./db');

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks.
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .query('SELECT * FROM Tasks;');
        
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
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get task by ID
 *     description: Retrieve a task by its ID.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        await pool.connect();
        const result = await pool.request()
            .input('TaskID', mssql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @TaskID;');
        
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Task not found' });
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
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with a given task name.
 *     parameters:
 *       - name: task
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             TaskName:
 *               type: string
 *             Point:
 *               type: integer
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request - Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    try {
        const { TaskName, Point } = req.body;
        // Validate input here if necessary
        
        await pool.connect();
        const result = await pool.request()
            .input('TaskName', mssql.NVarChar(255), TaskName)
            .input('Point', mssql.Int, Point)
            .query('INSERT INTO Tasks (TaskName, Point) VALUES (@TaskName, @Point);');
        
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }
});

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update task by ID
 *     description: Update a task by its ID.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *         description: ID of the task to update
 *       - name: task
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             TaskName:
 *               type: string
 *             Done:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request - Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { TaskName, Done } = req.body;
        // Validate input here if necessary
        
        await pool.connect();
        const result = await pool.request()
            .input('TaskName', mssql.NVarChar(255), TaskName)
            .input('Done', mssql.Bit, Done)
            .input('TaskID', mssql.Int, taskId)
            .query('UPDATE Tasks SET TaskName = @TaskName, Done = @Done WHERE TaskID = @TaskID;');
        
        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: 'Task not found' });
        } else {
            res.status(200).json({ message: 'Task updated successfully' });
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
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete task by ID
 *     description: Delete a task by its ID.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *         description: ID of the task to delete
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        await pool.connect();
        const result = await pool.request()
            .input('TaskID', mssql.Int, taskId)
            .query('DELETE FROM Tasks WHERE TaskID = @TaskID;');
        
        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: 'Task not found' });
        } else {
            res.status(204).end();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        pool.close();
    }
});

module.exports = router;
