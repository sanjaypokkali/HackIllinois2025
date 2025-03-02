use anchor_lang::prelude::*;

declare_id!("DVXpECCmeeVSVVH77G7SFFcRBaQoUgR522TrY8SxUPH9");

// #[program]
// pub mod pixsol {
//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         msg!("Hello, Pixsol!");
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize {}


#[program]
pub mod pixsol {
    use super::*;

    pub fn create_canvas(ctx: Context<CreateCanvas>, width: u32, height: u32) -> Result<()> {
        let canvas = &mut ctx.accounts.canvas;
        canvas.width = width;
        canvas.height = height;
        canvas.authority = ctx.accounts.user.key();
        canvas.creator = ctx.accounts.user.key(); // Store the creator's wallet address
        Ok(())
    }

    pub fn create_pixel(ctx: Context<CreatePixel>, x: u32, y: u32, color: [u8; 3]) -> Result<()> {
        let canvas = &ctx.accounts.canvas;
        let pixel = &mut ctx.accounts.pixel;
        let user = &ctx.accounts.user; // paying user (us)
        let modifier = &ctx.accounts.modifier; // user that is modifying the pixel
        pixel.x = x;
        pixel.y = y;
        pixel.color = color;
        pixel.canvas = canvas.key();
        pixel.modifier = modifier.key();
        pixel.timestamp = Clock::get()?.unix_timestamp;
        pixel.payer = user.key();
        Ok(())
    }

    // pub fn update_pixel(ctx: Context<UpdatePixel>, x: u32, y: u32, color: [u8; 3]) -> Result<()> {
    //     let canvas = &ctx.accounts.canvas;
    //     if x >= canvas.width || y >= canvas.height {
    //         return Err(ErrorCode::OutOfBounds.into());
    //     }
    //     let pixel = &mut ctx.accounts.pixel;
    //     pixel.color = color;
    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct CreateCanvas<'info> {
    #[account(init, payer = user, space = 8 + 32 + 4 + 4 + 32)] // Increased space for creator
    pub canvas: Account<'info, Canvas>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreatePixel<'info> {
    pub canvas: Account<'info, Canvas>,
    
    #[account(init, payer = user, space = 8 + 4 + 4 + 3 + 32 + 32 + 32 + 8)]
    pub pixel: Account<'info, Pixel>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub modifier: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct Canvas {
    pub authority: Pubkey,
    pub width: u32,
    pub height: u32,
    pub creator: Pubkey // Added field to store the creator's wallet address
}

#[account]
pub struct Pixel {
    pub x: u32,
    pub y: u32,
    pub color: [u8; 3],
    pub canvas: Pubkey,
    pub modifier: Pubkey,
    pub payer: Pubkey,
    pub timestamp: i64
}