import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaNftProject } from "../target/types/solana_nft_project";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { 
  PROGRAM_ID as METADATA_PROGRAM_ID 
} from "@metaplex-foundation/mpl-token-metadata";
import { Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";

describe("solana-nft-project", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaNftProject as Program<SolanaNftProject>;
  const provider = anchor.AnchorProvider.env();

  it("Mints an NFT!", async () => {
    // Generate a new keypair for the mint
    const mintKeypair = Keypair.generate();
    
    // Get the associated token account address
    const tokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      provider.wallet.publicKey
    );

    // Derive metadata account address
    const [metadata] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    // Derive master edition account address
    const [masterEdition] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      METADATA_PROGRAM_ID
    );

    // NFT metadata
    const nftName = "My First NFT";
    const nftSymbol = "MYNFT";
    const nftUri = "https://arweave.net/your-metadata-uri";

    // Mint the NFT
    const tx = await program.methods
      .mintNft(nftName, nftSymbol, nftUri)
      .accounts({
        payer: provider.wallet.publicKey,
        mint: mintKeypair.publicKey,
        tokenAccount,
        metadata,
        masterEdition,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        metadataProgram: METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    console.log("NFT minted successfully!");
    console.log("Transaction signature:", tx);
    console.log("Mint address:", mintKeypair.publicKey.toString());
    console.log("Token account:", tokenAccount.toString());
    console.log("Metadata account:", metadata.toString());
  });
});
