"""
Photo pipeline for the Elite Hair & Beauty website.

Sources (kept outside the repository, on the work drive):
  live-site-photos/  the salon's own photography, downloaded from elitehair.co.za at full size
  stock-unsplash/    licence-free editorial images (Unsplash Licence) for the gaps the salon has no
                     photography for yet: the campaign hero, bridal and beauty treatments. They are used
                     on service pages only, never in the gallery, which shows the salon's own work.

Every photo is exported as WebP at up to three widths (-640, -1280 and, for full-bleed images, -2000; never
upscaled) into frontend/src/assets/photos, and frontend/src/content/photos.json records its size, alt text,
gallery categories, placeholder tone and (for stock) its credit.

The before/after screenshots are split at their dark "before | after" strip into two matching halves, so the
site can show them as a drag-to-compare slider.

To add or replace a photo: put the file in one of the source folders, add or edit its line below, then run
    python3 tools/photos.py
(Set ELITE_ASSETS to point at a different source folder.)
"""
import json
import os

from PIL import Image, ImageOps, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.environ.get("ELITE_ASSETS", "/Volumes/Zet/Work/WEBSITES TO DO/Elite Hair and Beauty")
LIVE = os.path.join(ASSETS, "live-site-photos")
STOCK = os.path.join(ASSETS, "stock-unsplash")
OUT = os.path.join(ROOT, "frontend", "src", "assets", "photos")
MANIFEST = os.path.join(ROOT, "frontend", "src", "content", "photos.json")

# Gallery categories: transformations, colour, balayage, styling, nails, salon. [] = used on pages only.
# crop: (left, top, right, bottom) as fractions of the source. xl: also export a 2000px version.
P = {
    # --- The team (salon photography) ---------------------------------------------------------------
    "carla": dict(src="DSC_4096-copy.jpg", alt="Carla, owner and stylist, in the salon at Elite Hair & Beauty", crop=(0, 0.04, 1, 0.92)),
    "nikki": dict(src="DSCF2245.jpg", alt="Nikki, stylist at Elite Hair & Beauty"),
    "erin": dict(src="DSCF2257.jpg", alt="Erin, stylist at Elite Hair & Beauty"),
    "stacey": dict(src="Screenshot-2026-02-04-at-07.46.31.png", alt="Stacey, stylist at Elite Hair & Beauty"),
    "britney": dict(src="DSCF2247.jpg", alt="Britney, stylist at Elite Hair & Beauty"),
    "emma": dict(src="DSCF2254.jpg", alt="Emma, stylist at Elite Hair & Beauty"),
    "dane": dict(src="DSCF2242.jpg", alt="Dané, stylist at Elite Hair & Beauty"),
    "ilahm": dict(src="ilahm-2.jpg", alt="Ilahm, beautician at Elite Hair & Beauty", crop=(0.13, 0, 0.82, 1)),
    "megan": dict(src="Screenshot-2026-02-04-at-07.45.41.png", alt="Megan, health and beauty therapist at Elite Hair & Beauty"),
    "monique": dict(src="DSCF2259.jpg", alt="Monique, salon co-ordinator at Elite Hair & Beauty"),
    "sally": dict(src="Screenshot-2026-02-04-at-07.47.38.png", alt="Sally, blow-dry specialist at Elite Hair & Beauty"),
    "melody": dict(src="Screenshot-2026-02-04-at-07.47.12.png", alt="Melody, operator at Elite Hair & Beauty"),
    "rhina": dict(src="Screenshot-2026-02-04-at-07.47.04.png", alt="Rhina, operator at Elite Hair & Beauty"),
    "angie": dict(src="DSC_4164-copy.jpg", alt="Angie, operator at Elite Hair & Beauty", crop=(0, 0.04, 1, 0.92)),
    "carla-dylan": dict(src="WhatsApp-Image-2025-09-18-at-11.57.00_6199259f.jpg", alt="Carla and Dylan, the husband-and-wife team behind Elite Hair & Beauty"),
    "team": dict(src="team-pic-2.png", alt="The Elite Hair & Beauty team on the steps outside the salon at The1054, Walmer", xl=True),
    # --- In the salon --------------------------------------------------------------------------------
    "nails-at-elite": dict(src="19-2022-1-scaled.jpg", alt="A nail technician at work at the Elite nail bar", cats=["nails"]),
    "blowdry-at-elite": dict(src="21-22-scaled.jpg", alt="A stylist finishing a blow-dry in the salon", cats=["styling"]),
    "salon-lounge": dict(src="IMG_4419.jpg", alt="The welcome lounge: rattan pendant lights, cream chairs and the Elite retail wall", cats=["salon"], xl=True),
    "salon-palms": dict(src="IMG_4425.jpg", alt="A styling station against the palm-leaf feature wall", cats=["salon"]),
    "salon-retail": dict(src="IMG_4428.jpg", alt="The retail wall stocked with professional hair care beneath the Elite Hair & Beauty sign", cats=["salon"]),
    "salon-reception": dict(src="IMG_4397.jpg", alt="Reception and the Elite Hair & Beauty welcome desk", cats=["salon"], xl=True),
    "salon-floor": dict(src="IMG_4393.jpg", alt="Styling chairs and round mirrors on the salon floor", cats=["salon"]),
    "salon-stations": dict(src="IMG_4401.jpg", alt="Styling stations with shelving, plants and pendant lights", cats=["salon"]),
    "salon-light": dict(src="IMG_4404.jpg", alt="The salon floor in afternoon light", cats=["salon"]),
    "salon-mirrors": dict(src="IMG_4421.jpg", alt="Mirrored styling stations along the salon", cats=["salon"]),
    "salon-wide": dict(src="IMG_4422.jpg", alt="The open-plan salon at The1054 in Walmer", cats=["salon"]),
    "salon-working": dict(src="IMG_4423.jpg", alt="Stylists at work on the salon floor", cats=["salon"]),
    "salon-lounge-side": dict(src="IMG_4420.jpg", alt="The lounge and nail bar beside the retail wall", cats=["salon"]),
    "nail-bar": dict(src="IMG_4413.jpg", alt="A nail station by the window, with a wall of polish colours", cats=["nails"]),
    "nail-bar-colour": dict(src="IMG_4411.jpg", alt="The nail bar and its wall of polish beside the salon floor", cats=["nails"]),
    "salon-desk": dict(src="IMG_4412.jpg", alt="The Elite Hair & Beauty desk at the entrance", cats=["salon"]),
    "salon-entrance": dict(src="IMG_4417.jpg", alt="The glass entrance of Elite Hair & Beauty, unit 02 at The1054", cats=["salon"]),
    "salon-exterior": dict(src="IMG_4410.jpg", alt="Outside Elite Hair & Beauty at The1054, with Nioxin, Wella and Kadus window displays", cats=["salon"]),
    "salon-1054": dict(src="IMG_4418.jpg", alt="The1054 building, home of Elite Hair & Beauty on Main Road, Walmer", cats=["salon"]),
    # --- Stock: editorial imagery for the gaps (Unsplash Licence) -------------------------------------
    "hero": dict(src="hero-terracotta.jpg", stock=True, alt="A woman with glossy dark hair in motion, looking over her shoulder against a warm terracotta wall", xl=True, credit="3q08gnmPBko"),
    "editorial-blonde": dict(src="editorial-blonde.jpg", stock=True, alt="A woman with long, soft blonde waves in a black top", xl=True, credit="et_78QkMMQs"),
    "colour-waves": dict(src="colour-waves.jpg", stock=True, alt="Two women seen from behind, one with golden blonde waves and one with warm brunette waves", xl=True, credit="RpFQdgJ9gQw"),
    "sleek-bob": dict(src="sleek-bob.jpg", stock=True, alt="A glossy, precision-cut brunette bob seen from behind", credit="TcWwRcf92GY", crop=(0, 0.12, 1, 0.82)),
    "blowdry-brush": dict(src="blowdry-brush.jpg", stock=True, alt="A round brush smoothing long blonde hair during a blow-dry", credit="ezCE4"),
    "blowdry-salon": dict(src="blowdry-salon.jpg", stock=True, alt="A stylist blow-drying a client's hair with a round brush", xl=True, credit="FkAZqQJTbXM"),
    "hair-motion": dict(src="hair-motion-bw.jpg", stock=True, alt="A black-and-white portrait of a woman with hair caught in motion", credit="VFZF_pzTVBA"),
    "lashes": dict(src="lashes.jpg", stock=True, alt="A therapist applying lash extensions", credit="sRSRuxkOuzI"),
    "eye-makeup": dict(src="eye-makeup.jpg", stock=True, alt="Close-up of eyeshadow being blended with a fine brush", credit="aJ4DWng"),
    "nails-mauve": dict(src="nails-mauve.jpg", stock=True, alt="Hands with a mauve, white and silver manicure on soft knit", credit="1vzVds"),
    "nails-blush": dict(src="nails-blush.jpg", stock=True, alt="A hand with a soft blush manicure resting on cream fabric", credit="vtQHwU4F13s", crop=(0, 0.1, 1, 0.9)),
    "facial": dict(src="facial.jpg", stock=True, alt="A woman relaxing during a facial treatment", xl=True, credit="PqyzuzFiQfY"),
    "massage": dict(src="massage-candle.jpg", stock=True, alt="Hands giving a calming facial massage by candlelight", xl=True, credit="WAm_HaI4W2E"),
    "bridal-vine": dict(src="bridal-crystal-vine.jpg", stock=True, alt="A bride's loose waves woven with a crystal hair vine, seen from behind", xl=True, credit="yq2zyWLzaR0"),
    "bridal-braid": dict(src="bridal-braid-veil.jpg", stock=True, alt="A braided bridal updo with pearl pins and a veil", credit="ZgdAGqdFDd0"),
    "bridal-veil": dict(src="bridal-veil-headpiece.jpg", stock=True, alt="A bride with a jewelled headpiece and sheer veil, seen from behind", xl=True, credit="nKsev-cGRuA"),
    "bridal-chignon": dict(src="bridal-chignon-pearls.jpg", stock=True, alt="A low blonde chignon finished with pearl pins", credit="jJr6EJrf124"),
    "bridal-laughing": dict(src="bridal-laughing-bw.jpg", stock=True, alt="A laughing bride with soft waves and a veil, in black and white", credit="Q4otPDG3NTQ"),
    "bridal-ready": dict(src="bridal-getting-ready.jpg", stock=True, alt="A bride being laced into her gown on the morning of the wedding", xl=True, credit="BPwR5_GSe0"),
    "bridal-makeup": dict(src="bridal-makeup.jpg", stock=True, alt="A make-up artist applying blush to a bride in a satin robe", credit="tKUG1Ckuryw"),
    "bridal-updo": dict(src="bridal-updo-stylist.jpg", stock=True, alt="A stylist setting a sculpted bridal updo with a jewelled pin", xl=True, credit="EEo_VkcATgw"),
}

# Before & after (salon screenshots, split at the strip). tags: gallery categories besides "transformations".
BA = [
    ("Screenshot-2025-02-25-at-11.12.16.png", "Wavy dark-blonde hair", "Bright, blended blonde balayage", ["balayage", "colour"]),
    ("Screenshot-2025-02-25-at-11.25.59.png", "Long, flat brunette hair", "Glossy, defined brunette waves", ["styling"]),
    ("Screenshot-2025-02-26-at-14.02.53.png", "Brassy blonde lengths", "Cool, icy blonde, sleek and straight", ["colour"]),
    ("Screenshot-2025-02-26-at-14.03.16.png", "Dark brunette lengths", "Soft blonde balayage with loose waves", ["balayage"]),
    ("Screenshot-2025-02-26-at-14.03.32.png", "Brown hair with grown-out ends", "Light, even all-over blonde", ["colour"]),
    ("Screenshot-2025-02-26-at-14.03.49.png", "Faded light-brown lengths", "Rich, glossy dark brunette", ["colour"]),
    ("Screenshot-2025-02-26-at-14.04.08.png", "Solid black hair", "Caramel balayage with soft movement", ["balayage"]),
    ("Screenshot-2025-02-26-at-14.04.24.png", "Faded orange curls", "Vivid copper curls", ["colour", "styling"]),
    ("Screenshot-2025-02-26-at-14.04.43.png", "Long blonde lengths", "Warm brunette with defined waves", ["colour", "styling"]),
]

WIDTHS = (640, 1280)
XL = 2000


def tone(img):
    r, g, b = img.resize((1, 1), Image.Resampling.BOX).getpixel((0, 0))[:3]
    return f"#{r:02x}{g:02x}{b:02x}"


def export(key, img, xl=False):
    w, h = img.size
    sizes = []
    for target in WIDTHS + ((XL,) if xl else ()):
        if sizes and w <= sizes[-1]:
            break  # never upscale; one export at the source width is enough
        width = min(target, w)
        out = img if width == w else img.resize((width, round(h * width / w)), Image.Resampling.LANCZOS)
        out.save(os.path.join(OUT, f"{key}-{target}.webp"), "WEBP", quality=80, method=6)
        sizes.append(width)
    return sizes


def open_img(path, crop=None):
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    if crop:
        w, h = img.size
        img = img.crop((round(crop[0] * w), round(crop[1] * h), round(crop[2] * w), round(crop[3] * h)))
    return img


def split_before_after(img):
    """Find the dark grey strip in the middle of the screenshot and return (before, after) halves of equal size."""
    w, h = img.size
    gray = img.convert("L").resize((w // 2, h // 4))
    W, H = gray.size
    px = gray.load()
    def is_strip(x):
        col = [px[x, y] for y in range(H // 5, 4 * H // 5)]
        mean = sum(col) / len(col)
        var = sum((c - mean) ** 2 for c in col) / len(col)
        return 40 < mean < 90 and var < 120
    mid = [x for x in range(int(W * 0.3), int(W * 0.7)) if is_strip(x)]
    left, right = min(mid) * 2, max(mid) * 2 + 2
    # Trim a little more so no trace of the strip (or its green rules) remains.
    before = img.crop((0, 0, left - 6, h))
    after = img.crop((right + 6, 0, w, h))
    cw = min(before.size[0], after.size[0])
    # Keep the side of each photo nearest the strip (where the hair is) and crop both to the same width.
    before = before.crop((before.size[0] - cw, 0, before.size[0], h))
    after = after.crop((0, 0, cw, h))
    # Remove the screenshot's top and bottom few pixels (window chrome).
    t, b = round(h * 0.01), round(h * 0.99)
    return before.crop((0, t, cw, b)), after.crop((0, t, cw, b))


def main():
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith(".webp"):
            os.remove(os.path.join(OUT, f))
    manifest = {}
    for key, p in P.items():
        img = open_img(os.path.join(STOCK if p.get("stock") else LIVE, p["src"]), p.get("crop"))
        sizes = export(key, img, p.get("xl", False))
        manifest[key] = {
            "sizes": sizes,
            "width": img.size[0],
            "height": img.size[1],
            "alt": p["alt"],
            "cats": p.get("cats", []),
            "tone": tone(img),
            **({"credit": f"https://unsplash.com/photos/{p['credit']}"} if p.get("credit") else {}),
        }
        print(f"{key:20} {img.size[0]}x{img.size[1]} -> {sizes}")

    for i, (src, before_alt, after_alt, tags) in enumerate(BA, start=1):
        before, after = split_before_after(open_img(os.path.join(LIVE, src)))
        for side, img, alt in (("before", before, before_alt), ("after", after, after_alt)):
            key = f"ba{i}-{side}"
            sizes = export(key, img)
            manifest[key] = {
                "sizes": sizes,
                "width": img.size[0],
                "height": img.size[1],
                "alt": f"{'Before' if side == 'before' else 'After'}: {alt.lower() if side == 'before' else alt}",
                "cats": ["transformations", *tags] if side == "after" else [],
                "tone": tone(img),
                **({"pair": f"ba{i}-before"} if side == "after" else {}),
            }
            print(f"{key:20} {img.size[0]}x{img.size[1]} -> {sizes}")

    with open(MANIFEST, "w") as fh:
        json.dump(manifest, fh, indent=1, ensure_ascii=False)
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print(f"\n{len(manifest)} photos, {len(os.listdir(OUT))} files, {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
