use anchor_lang::prelude::*;

declare_id!("EqvXgPF29CWxTp7a7ZFrvtM87cs3e24EwpFPCiw6bEAU");

#[program]
pub mod solana_nft_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
