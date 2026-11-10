import React, { useState } from 'react';
import { Plus, Minus, Check, Scissors, Sparkles, Shirt } from 'lucide-react';
import { CustomizationOption, BlouseCustomization } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface ProductAddonsProps {
  departmentId?: string;
  category?: string;
  onChange: (customization: CustomizationOption) => void;
}

export const ProductAddons: React.FC<ProductAddonsProps> = ({
  departmentId,
  category,
  onChange,
}) => {
  const { formatPrice } = useCurrency();

  // Accordion open states
  const [isFallPicoOpen, setIsFallPicoOpen] = useState(false);
  const [isBlouseOpen, setIsBlouseOpen] = useState(false);
  const [isTasselsOpen, setIsTasselsOpen] = useState(false);
  const [isPetticoatOpen, setIsPetticoatOpen] = useState(false);

  // Selection states
  const [fallAndPicoSelected, setFallAndPicoSelected] = useState(false);
  const [blouseStitchingType, setBlouseStitchingType] = useState<'none' | 'standard' | 'padded' | 'aari'>('none');
  const [blouseBustSize, setBlouseBustSize] = useState('36');
  const [blouseSleeveStyle, setBlouseSleeveStyle] = useState('Elbow Length (10-11")');
  const [blouseNeckStyle, setBlouseNeckStyle] = useState('Boat Neck');
  const [blouseBackOpening, setBlouseBackOpening] = useState('Back Open (Hook & Eye + Dori & Latkan)');
  const [blouseNotes, setBlouseNotes] = useState('');

  const [tasselsSelected, setTasselsSelected] = useState(false);
  const [petticoatType, setPetticoatType] = useState<'none' | 'cotton' | 'shapewear'>('none');

  // Prices
  const FALL_PICO_PRICE = 199;
  const BLOUSE_PRICES = {
    none: 0,
    standard: 499,
    padded: 799,
    aari: 1299,
  };
  const TASSELS_PRICE = 249;
  const PETTICOAT_PRICES = {
    none: 0,
    cotton: 299,
    shapewear: 499,
  };

  const calculateAndEmit = (
    fp: boolean,
    blouseType: 'none' | 'standard' | 'padded' | 'aari',
    bust: string,
    sleeve: string,
    neck: string,
    back: string,
    notes: string,
    tassels: boolean,
    petType: 'none' | 'cotton' | 'shapewear'
  ) => {
    const fpPrice = fp ? FALL_PICO_PRICE : 0;
    const blousePrice = BLOUSE_PRICES[blouseType];
    const tasPrice = tassels ? TASSELS_PRICE : 0;
    const petPrice = PETTICOAT_PRICES[petType];
    const total = fpPrice + blousePrice + tasPrice + petPrice;

    let blouseData: BlouseCustomization | undefined = undefined;
    if (blouseType !== 'none') {
      const typeLabels = {
        standard: 'Standard Tailored Stitching',
        padded: 'Padded Designer Blouse',
        aari: 'Aari Work / Hand Embroidered',
      };
      blouseData = {
        stitchingType: typeLabels[blouseType],
        bustSize: bust,
        sleeveStyle: sleeve,
        neckStyle: neck,
        backOpening: back,
        price: blousePrice,
        notes: notes.trim() || undefined,
      };
    }

    const custom: CustomizationOption = {
      fallAndPico: fp,
      fallAndPicoPrice: fp ? FALL_PICO_PRICE : 0,
      blouseCustomization: blouseData,
      tassels: tassels,
      tasselsPrice: tassels ? TASSELS_PRICE : 0,
      petticoat: petType !== 'none',
      petticoatType: petType === 'cotton' ? 'Pure Cotton Inskirt' : (petType === 'shapewear' ? 'Mermaid Saree Shapewear' : undefined),
      petticoatPrice: petPrice,
      totalAddonPrice: total,
    };

    onChange(custom);
  };

  const toggleFallAndPico = () => {
    const next = !fallAndPicoSelected;
    setFallAndPicoSelected(next);
    if (next) setIsFallPicoOpen(true);
    calculateAndEmit(next, blouseStitchingType, blouseBustSize, blouseSleeveStyle, blouseNeckStyle, blouseBackOpening, blouseNotes, tasselsSelected, petticoatType);
  };

  const selectBlouseType = (type: 'none' | 'standard' | 'padded' | 'aari') => {
    setBlouseStitchingType(type);
    if (type !== 'none') setIsBlouseOpen(true);
    calculateAndEmit(fallAndPicoSelected, type, blouseBustSize, blouseSleeveStyle, blouseNeckStyle, blouseBackOpening, blouseNotes, tasselsSelected, petticoatType);
  };

  const selectBustSize = (size: string) => {
    setBlouseBustSize(size);
    calculateAndEmit(fallAndPicoSelected, blouseStitchingType, size, blouseSleeveStyle, blouseNeckStyle, blouseBackOpening, blouseNotes, tasselsSelected, petticoatType);
  };

  const selectSleeveStyle = (style: string) => {
    setBlouseSleeveStyle(style);
    calculateAndEmit(fallAndPicoSelected, blouseStitchingType, blouseBustSize, style, blouseNeckStyle, blouseBackOpening, blouseNotes, tasselsSelected, petticoatType);
  };

  const selectNeckStyle = (style: string) => {
    setBlouseNeckStyle(style);
    calculateAndEmit(fallAndPicoSelected, blouseStitchingType, blouseBustSize, blouseSleeveStyle, style, blouseBackOpening, blouseNotes, tasselsSelected, petticoatType);
  };

  const selectBackOpening = (back: string) => {
    setBlouseBackOpening(back);
    calculateAndEmit(fallAndPicoSelected, blouseStitchingType, blouseBustSize, blouseSleeveStyle, blouseNeckStyle, back, blouseNotes, tasselsSelected, petticoatType);
  };

  const updateNotes = (notes: string) => {
    setBlouseNotes(notes);
    calculateAndEmit(fallAndPicoSelected, blouseStitchingType, blouseBustSize, blouseSleeveStyle, blouseNeckStyle, blouseBackOpening, notes, tasselsSelected, petticoatType);
  };

  const toggleTassels = () => {
    const next = !tasselsSelected;
    setTasselsSelected(next);
    if (next) setIsTasselsOpen(true);
    calculateAndEmit(fallAndPicoSelected, blouseStitchingType, blouseBustSize, blouseSleeveStyle, blouseNeckStyle, blouseBackOpening, blouseNotes, next, petticoatType);
  };

  const selectPetticoatType = (type: 'none' | 'cotton' | 'shapewear') => {
    setPetticoatType(type);
    if (type !== 'none') setIsPetticoatOpen(true);
    calculateAndEmit(fallAndPicoSelected, blouseStitchingType, blouseBustSize, blouseSleeveStyle, blouseNeckStyle, blouseBackOpening, blouseNotes, tasselsSelected, type);
  };

  const totalAddonsPrice =
    (fallAndPicoSelected ? FALL_PICO_PRICE : 0) +
    BLOUSE_PRICES[blouseStitchingType] +
    (tasselsSelected ? TASSELS_PRICE : 0) +
    PETTICOAT_PRICES[petticoatType];

  return (
    <div className="bg-[#FAFDF9] rounded-2xl border border-emerald-100/90 p-4 sm:p-5 shadow-xs text-left">
      {/* Header matching user's screenshot */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm sm:text-base font-black text-black tracking-tight">
          Add-ons & Related Products
        </h3>
        {totalAddonsPrice > 0 && (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            +{formatPrice(totalAddonsPrice)} added
          </span>
        )}
      </div>
      <p className="text-xs text-[#5C554E] mb-3.5 font-medium">Enhance your purchase</p>

      <div className="space-y-2.5">
        {/* ========================================================= */}
        {/* 1. Fall And Pico (Accordion matching user screenshot)     */}
        {/* ========================================================= */}
        <div
          className={`rounded-xl border transition overflow-hidden bg-white ${
            fallAndPicoSelected ? 'border-emerald-600 ring-1 ring-emerald-500/20' : 'border-[#E5DCD3]'
          }`}
        >
          <div
            onClick={() => setIsFallPicoOpen(!isFallPicoOpen)}
            className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 select-none"
          >
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFallAndPico();
                }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                  fallAndPicoSelected
                    ? 'bg-black border-black text-white'
                    : 'border-[#C8BFB5] hover:border-black bg-white'
                }`}
                aria-label="Toggle Fall and Pico"
              >
                {fallAndPicoSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div>
                <span className="text-xs sm:text-sm font-bold text-black block">Fall And Pico</span>
                <span className="text-[10px] text-[#5C554E]">Flawless drape & neat pallu finish</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-black">+{formatPrice(FALL_PICO_PRICE)}</span>
              <button
                type="button"
                className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-black font-bold transition"
              >
                {isFallPicoOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {isFallPicoOpen && (
            <div className="px-3.5 pb-3.5 pt-1 border-t border-[#F0EAE1] bg-[#FAF8F5] text-xs space-y-2">
              <p className="text-[11px] text-[#5C554E] leading-relaxed">
                Includes premium high-density cotton fall hand-stitched along the bottom pleats for structured drape, plus high-precision overlock pico edging along the pallu edge.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Ready to wear upon arrival
                </span>
                <button
                  type="button"
                  onClick={toggleFallAndPico}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                    fallAndPicoSelected
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {fallAndPicoSelected ? 'Remove' : 'Add Fall & Pico'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 2. Blouse Customization ("blose customiztion")             */}
        {/* ========================================================= */}
        <div
          className={`rounded-xl border transition overflow-hidden bg-white ${
            blouseStitchingType !== 'none'
              ? 'border-emerald-600 ring-1 ring-emerald-500/20'
              : 'border-[#E5DCD3]'
          }`}
        >
          <div
            onClick={() => setIsBlouseOpen(!isBlouseOpen)}
            className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Scissors className="w-3 h-3" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-black">Blouse Customization</span>
                  <span className="text-[9px] uppercase font-black bg-[#FF6B5B] text-white px-1.5 py-0.2 rounded tracking-wide">
                    POPULAR
                  </span>
                </div>
                <span className="text-[10px] text-[#5C554E]">
                  {blouseStitchingType === 'none'
                    ? 'Get your unstitched blouse custom stitched'
                    : `Selected: ${blouseStitchingType.toUpperCase()} (Bust: ${blouseBustSize}")`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-black">
                {blouseStitchingType === 'none'
                  ? `From +${formatPrice(BLOUSE_PRICES.standard)}`
                  : `+${formatPrice(BLOUSE_PRICES[blouseStitchingType])}`}
              </span>
              <button
                type="button"
                className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-black font-bold transition"
              >
                {isBlouseOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {isBlouseOpen && (
            <div className="px-3.5 pb-4 pt-2 border-t border-[#F0EAE1] bg-[#FAF8F5] text-xs space-y-3.5">
              {/* Stitching Type Selector */}
              <div>
                <label className="font-bold text-black block mb-1.5 text-[11px] uppercase tracking-wide">
                  1. Choose Stitching Style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => selectBlouseType('none')}
                    className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                      blouseStitchingType === 'none'
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                    }`}
                  >
                    <span>Unstitched Piece (Default)</span>
                    <span className="text-[11px] opacity-80">Free</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBlouseType('standard')}
                    className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                      blouseStitchingType === 'standard'
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                    }`}
                  >
                    <span>Standard Tailored Stitching</span>
                    <span className="text-[11px] font-bold">+{formatPrice(BLOUSE_PRICES.standard)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBlouseType('padded')}
                    className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                      blouseStitchingType === 'padded'
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                    }`}
                  >
                    <span>Padded Designer Blouse</span>
                    <span className="text-[11px] font-bold">+{formatPrice(BLOUSE_PRICES.padded)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBlouseType('aari')}
                    className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                      blouseStitchingType === 'aari'
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                    }`}
                  >
                    <span>Aari / Zari Hand Embroidery</span>
                    <span className="text-[11px] font-bold">+{formatPrice(BLOUSE_PRICES.aari)}</span>
                  </button>
                </div>
              </div>

              {blouseStitchingType !== 'none' && (
                <div className="space-y-3 pt-2 border-t border-[#E5DCD3]/70">
                  {/* Bust Size Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-black text-[11px] uppercase tracking-wide">
                        2. Blouse Bust Size (Inches):
                      </label>
                      <span className="text-[10px] text-[#5C554E]">Standard bra size reference</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['32', '34', '36', '38', '40', '42', '44', 'Custom'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => selectBustSize(sz)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                            blouseBustSize === sz
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                          }`}
                        >
                          {sz === 'Custom' ? 'Custom Measurement' : `${sz}"`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sleeve Style Selector */}
                  <div>
                    <label className="font-bold text-black block mb-1.5 text-[11px] uppercase tracking-wide">
                      3. Sleeve Style:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Elbow Length (10-11")',
                        'Short Sleeves (6-7")',
                        'Sleeveless',
                        'Full Sleeves (18-20")',
                      ].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => selectSleeveStyle(style)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                            blouseSleeveStyle === style
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Neckline Selector */}
                  <div>
                    <label className="font-bold text-black block mb-1.5 text-[11px] uppercase tracking-wide">
                      4. Neckline Design:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Boat Neck', 'Round Neck', 'Deep U-Neck', 'Sweetheart Neck', 'Square Neck'].map((neck) => (
                        <button
                          key={neck}
                          type="button"
                          onClick={() => selectNeckStyle(neck)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                            blouseNeckStyle === neck
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                          }`}
                        >
                          {neck}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Back Opening Selector */}
                  <div>
                    <label className="font-bold text-black block mb-1.5 text-[11px] uppercase tracking-wide">
                      5. Back Closure & Ties:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Back Open (Hook & Eye + Dori & Latkan)',
                        'Front Open Hooks',
                      ].map((back) => (
                        <button
                          key={back}
                          type="button"
                          onClick={() => selectBackOpening(back)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                            blouseBackOpening === back
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                          }`}
                        >
                          {back}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tailoring Notes */}
                  <div>
                    <label className="font-bold text-black block mb-1 text-[11px] uppercase tracking-wide">
                      6. Custom Tailoring Notes (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., Keep 2-inch margin inside; front neck depth 6.5 in"
                      value={blouseNotes}
                      onChange={(e) => updateNotes(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5DCD3] rounded-lg outline-none focus:border-black font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 3. Handcrafted Pallu Tassels (Kuchu)                      */}
        {/* ========================================================= */}
        <div
          className={`rounded-xl border transition overflow-hidden bg-white ${
            tasselsSelected ? 'border-emerald-600 ring-1 ring-emerald-500/20' : 'border-[#E5DCD3]'
          }`}
        >
          <div
            onClick={() => setIsTasselsOpen(!isTasselsOpen)}
            className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 select-none"
          >
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTassels();
                }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                  tasselsSelected
                    ? 'bg-black border-black text-white'
                    : 'border-[#C8BFB5] hover:border-black bg-white'
                }`}
                aria-label="Toggle Pallu Tassels"
              >
                {tasselsSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div>
                <span className="text-xs sm:text-sm font-bold text-black block">Handmade Pallu Tassels (Kuchu)</span>
                <span className="text-[10px] text-[#5C554E]">Intricate silk thread bead tassels on pallu fringe</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-black">+{formatPrice(TASSELS_PRICE)}</span>
              <button
                type="button"
                className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-black font-bold transition"
              >
                {isTasselsOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {isTasselsOpen && (
            <div className="px-3.5 pb-3.5 pt-1 border-t border-[#F0EAE1] bg-[#FAF8F5] text-xs space-y-2">
              <p className="text-[11px] text-[#5C554E] leading-relaxed">
                Hand-knotted pure silk thread tassels embellished with golden zari beads along the saree's entire pallu edge. Traditional Chettinad and bridal finish.
              </p>
              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={toggleTassels}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                    tasselsSelected
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {tasselsSelected ? 'Remove' : 'Add Pallu Tassels'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 4. Matching Petticoat / Shapewear                         */}
        {/* ========================================================= */}
        <div
          className={`rounded-xl border transition overflow-hidden bg-white ${
            petticoatType !== 'none' ? 'border-emerald-600 ring-1 ring-emerald-500/20' : 'border-[#E5DCD3]'
          }`}
        >
          <div
            onClick={() => setIsPetticoatOpen(!isPetticoatOpen)}
            className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <Shirt className="w-3 h-3" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-black block">Matching Saree Inskirt / Shapewear</span>
                <span className="text-[10px] text-[#5C554E]">
                  {petticoatType === 'none'
                    ? 'Breathable cotton or targeted mermaid shapewear'
                    : `Selected: ${petticoatType === 'cotton' ? 'Pure Cotton Inskirt' : 'Mermaid Shapewear'}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-black">
                {petticoatType === 'none'
                  ? `From +${formatPrice(PETTICOAT_PRICES.cotton)}`
                  : `+${formatPrice(PETTICOAT_PRICES[petticoatType])}`}
              </span>
              <button
                type="button"
                className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-black font-bold transition"
              >
                {isPetticoatOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {isPetticoatOpen && (
            <div className="px-3.5 pb-3.5 pt-2 border-t border-[#F0EAE1] bg-[#FAF8F5] text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => selectPetticoatType('none')}
                  className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                    petticoatType === 'none'
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                  }`}
                >
                  <span>None</span>
                  <span className="text-[11px] opacity-80">₹0</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectPetticoatType('cotton')}
                  className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                    petticoatType === 'cotton'
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                  }`}
                >
                  <span>100% Pure Cotton Inskirt (Free Size)</span>
                  <span className="text-[11px] font-bold">+{formatPrice(PETTICOAT_PRICES.cotton)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectPetticoatType('shapewear')}
                  className={`p-2 rounded-lg border text-left transition flex items-center justify-between sm:col-span-2 ${
                    petticoatType === 'shapewear'
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                  }`}
                >
                  <span>Mermaid Saree Silhouette Shapewear (Side Slit)</span>
                  <span className="text-[11px] font-bold">+{formatPrice(PETTICOAT_PRICES.shapewear)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductAddons;
