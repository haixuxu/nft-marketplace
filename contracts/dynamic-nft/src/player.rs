use dynamic_nft_io::*;
use gstd::exec;

static mut SEED: u8 = 0;

pub fn get_random_value(range: u8) -> u8 {
    let seed = unsafe { SEED };
    unsafe { SEED = SEED.wrapping_add(1) };
    let mut random_input: [u8; 32] = exec::program_id().into();
    random_input[0] = random_input[0].wrapping_add(seed);
    let (random, _) = exec::random(random_input).expect("Error in getting random number");
    random[0] % range
}

fn get_u16_random() -> u16 {
    let p1 = get_random_value(255) as u16;
    let p2 = get_random_value(255) as u16;
    p1 << 8 | p2
}

pub fn generate_random_nft_dynamic_info() -> NftDynamicInfo {

    let rarity: u8 = get_random_value(8) + 1; // 0-8 + offset 1
    let sex: u8 = get_random_value(2); // 0-1
    let physical_attack: u16 = get_u16_random();
    let magic_attack: u16 = get_u16_random();
    let physical_defense: u16 = get_u16_random();
    let magic_defense: u16 = get_u16_random();

    NftDynamicInfo {
        rarity,
        sex,
        age: 0,
        physical_attack,
        magic_attack,
        physical_defense,
        magic_defense,
    }
}

pub fn update_nft_dynamic_info(nft: &mut NftDynamicInfo) {
    nft.physical_attack = get_u16_random();
    nft.magic_attack = get_u16_random();
    nft.physical_defense = get_u16_random();
    nft.magic_defense = get_u16_random();
}
