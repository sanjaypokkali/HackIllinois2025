use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("PixSo1P1aceProgram111111111111111111111111");

#[program]
pub mod solana_place {
    use super::*;

    // Create a new canvas (admin only)
    pub fn create_canvas(ctx: Context<CreateCanvas>, width: u32, height: u32) -> Result<()> {
        let canvas = &mut ctx.accounts.canvas;
        let admin = &ctx.accounts.admin;
        
        // Initialize the canvas
        canvas.admin = admin.key();
        canvas.width = width;
        canvas.height = height;
        canvas.created_at = Clock::get()?.unix_timestamp;
        
        msg!("Canvas created with dimensions {}x{}", width, height);
        Ok(())
    }

    // Set pixel color on the canvas
    pub fn set_pixel(ctx: Context<SetPixel>, x: u32, y: u32, color: u32) -> Result<()> {
        let canvas = &ctx.accounts.canvas;
        let pixel = &mut ctx.accounts.pixel;
        let user = &ctx.accounts.user;
        
        // Check if the coordinates are within canvas bounds
        require!(
            x < canvas.width && y < canvas.height,
            PixelError::OutOfBounds
        );
        
        // Initialize or update the pixel
        if !pixel.is_initialized {
            pixel.is_initialized = true;
            pixel.canvas = canvas.key();
        }
        
        pixel.x = x;
        pixel.y = y;
        pixel.color = color;
        pixel.owner = user.key();
        pixel.last_updated = Clock::get()?.unix_timestamp;
        
        msg!("Pixel at ({}, {}) set to color {} by {}", x, y, color, user.key());
        Ok(())
    }
}

// Account structure for Canvas
#[account]
pub struct Canvas {
    pub admin: Pubkey,           // Admin who created the canvas
    pub width: u32,              // Width of the canvas
    pub height: u32,             // Height of the canvas
    pub created_at: i64,         // Timestamp when canvas was created
}

// Account structure for Pixel
#[account]
pub struct Pixel {
    pub is_initialized: bool,    // Whether the pixel has been set
    pub canvas: Pubkey,          // The canvas this pixel belongs to
    pub x: u32,                  // X coordinate
    pub y: u32,                  // Y coordinate
    pub color: u32,              // Color value
    pub owner: Pubkey,           // User who last modified this pixel
    pub last_updated: i64,       // Timestamp of last update
}

// Context for creating a canvas
#[derive(Accounts)]
pub struct CreateCanvas<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + size_of::<Canvas>()
    )]
    pub canvas: Account<'info, Canvas>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// Context for setting a pixel
#[derive(Accounts)]
#[instruction(x: u32, y: u32, color: u32)]
pub struct SetPixel<'info> {
    #[account(mut)]
    pub canvas: Account<'info, Canvas>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + size_of::<Pixel>(),
        seeds = [
            b"pixel".as_ref(),
            canvas.key().as_ref(),
            &x.to_le_bytes(),
            &y.to_le_bytes()
        ],
        bump
    )]
    pub pixel: Account<'info, Pixel>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// Custom error codes
#[error_code]
pub enum PixelError {
    #[msg("Pixel coordinates are out of canvas bounds")]
    OutOfBounds,
}