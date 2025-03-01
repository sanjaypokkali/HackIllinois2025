use anchor_lang::prelude::*;

declare_id!("DVXpECCmeeVSVVH77G7SFFcRBaQoUgR522TrY8SxUPH9");

#[program]
pub mod pixsol {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, Pixsol!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}