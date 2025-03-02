const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

/**
 * GET /api/canvas/:canvasId
 * Returns the canvas data for a specific canvas ID
 */
router.get('/:canvasId/state', async (req, res, next) => {
  try {
    const { canvasId } = req.params;
    
    // Path to the canvas data file
    const filePath = path.join(__dirname, '..', 'data', 'canvas', `${canvasId}.json`);
    
    try {
      // Check if file exists
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: `Canvas with ID ${canvasId} not found`
      });
    }
    
    // Read and parse the canvas data file
    const data = await fs.readFile(filePath, 'utf8');
    const canvasData = JSON.parse(data);
    
    return res.status(200).json({
      success: true,
      data: canvasData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/canvas/:canvasId/history
 * Returns the history of changes for a specific canvas
 */
router.get('/:canvasId/history', async (req, res, next) => {
  try {
    const { canvasId } = req.params;
    
    // Path to the canvas history file
    const filePath = path.join(__dirname, '..', 'data', 'canvas', `${canvasId}_history.json`);
    
    try {
      // Check if file exists
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: `Canvas history for ID ${canvasId} not found`
      });
    }
    
    // Read and parse the canvas history file
    const data = await fs.readFile(filePath, 'utf8');
    const canvasHistory = JSON.parse(data);
    
    return res.status(200).json({
      success: true,
      data: canvasHistory
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;