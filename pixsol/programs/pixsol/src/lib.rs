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
}

#[derive(Accounts)]
pub struct CreateCanvas<'info> {
    #[account(init, payer = user, space = 8 + 32 + 4 + 4 + 32)] // Increased space for creator
    pub canvas: Account<'info, Canvas>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct Canvas {
    pub authority: Pubkey,
    pub width: u32,
    pub height: u32,
    pub creator: Pubkey // Added field to store the creator's wallet address
}