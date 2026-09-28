import svgPaths from "./svg-i11tmalxjr";
import imgImageClassicBeefBurgerWithFries from "figma:asset/c1c134b6b04556e4aeb20b3b45766f3387389288.png";
import imgImagePepperoniPizzaLarge from "figma:asset/9bea1d272dcee74715baff6c9136c031cb4bda7b.png";
import imgImageFreshGardenSalad from "figma:asset/13a079ff4c8571f2d88578217c13f7b65fbb66b3.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pff564c0} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#e95322] relative rounded-[14px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[30px] relative shrink-0 w-[86.063px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-0 not-italic text-[#0a0a0a] text-[20px] top-[-0.6px]">MealGo</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Text />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[88.8px] items-start left-0 pb-[0.8px] pt-[24px] px-[32px] top-0 w-[1072px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b-[0.8px] border-solid inset-0 pointer-events-none" />
      <Container />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#e95322] text-[14px] top-[-0.4px]">⭐ 4.8</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#ffdecf] h-[37px] relative rounded-[26843500px] shrink-0 w-[75.85px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[16px] relative size-full">
        <Paragraph />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[36px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[-0.8px]">The Gourmet Kitchen</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-0.6px]">American • Burgers • Pizza</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[64px] relative shrink-0 w-[245.063px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[12px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-white h-[112px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[30px] left-0 not-italic text-[#0a0a0a] text-[20px] top-[-0.6px]">Your Order</p>
    </div>
  );
}

function ImageClassicBeefBurgerWithFries() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[80px]" data-name="Image (Classic Beef Burger with Fries)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgImageClassicBeefBurgerWithFries} />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.6px]">Classic Beef Burger with Fries</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27px] left-0 not-italic text-[#e95322] text-[18px] top-[0.4px]">$14.99</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="flex-[1_0_0] h-[80px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading2 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[26843500px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e95322] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[26843500px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.6px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[16.15px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-0.6px]">2</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#e95322] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[26843500px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[80px] relative shrink-0 w-[112px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button />
        <Text1 />
        <Button1 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[16px] h-[96.8px] items-start pb-[0.8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b-[0.8px] border-solid inset-0 pointer-events-none" />
      <ImageClassicBeefBurgerWithFries />
      <Container10 />
      <Container11 />
    </div>
  );
}

function ImagePepperoniPizzaLarge() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[80px]" data-name="Image (Pepperoni Pizza (Large))">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgImagePepperoniPizzaLarge} />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.6px]">Pepperoni Pizza (Large)</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27px] left-0 not-italic text-[#e95322] text-[18px] top-[0.4px]">$18.99</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] h-[80px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading3 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[26843500px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e95322] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[26843500px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.6px] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[16.28px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-0.6px]">1</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#e95322] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[26843500px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[80px] relative shrink-0 w-[112px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button2 />
        <Text2 />
        <Button3 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[16px] h-[96.8px] items-start pb-[0.8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b-[0.8px] border-solid inset-0 pointer-events-none" />
      <ImagePepperoniPizzaLarge />
      <Container13 />
      <Container14 />
    </div>
  );
}

function ImageFreshGardenSalad() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[80px]" data-name="Image (Fresh Garden Salad)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgImageFreshGardenSalad} />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.6px]">Fresh Garden Salad</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27px] left-0 not-italic text-[#e95322] text-[18px] top-[0.4px]">$9.99</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="flex-[1_0_0] h-[80px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading4 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[26843500px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e95322] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[26843500px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.6px] relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[16.28px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-0.6px]">1</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#e95322] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[26843500px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[80px] relative shrink-0 w-[112px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button4 />
        <Text3 />
        <Button5 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[16px] h-[80px] items-start relative shrink-0 w-full" data-name="Container">
      <ImageFreshGardenSalad />
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[305.6px] items-start relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container12 />
      <Container15 />
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white h-[399.6px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading1 />
        <Container8 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_4005_709)" id="Icon">
          <path d={svgPaths.p2f0db680} id="Vector" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pefbf980} fill="var(--fill-0, #E95322)" id="Vector_2" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_4005_709">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[27px] relative shrink-0 w-[106.338px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[27px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.4px]">Promo Code</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[12px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon7 />
      <Heading5 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[1_0_0] h-[49.6px] min-h-px min-w-px relative rounded-[12px]" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">Enter promo code</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#e95322] h-[49.6px] relative rounded-[12px] shrink-0 w-[92px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[46px] not-italic text-[16px] text-center text-white top-[12.2px]">Apply</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[12px] h-[49.6px] items-start relative shrink-0 w-full" data-name="Container">
      <TextInput />
      <Button6 />
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-white h-[136.6px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[24px] px-[24px] relative size-full">
        <Container19 />
        <Container20 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p26ddc800} id="Vector" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[27px] relative shrink-0 w-[146.525px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[27px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.4px]">Delivery Address</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[12px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Heading6 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[16px] w-[720px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.6px]">123 Main Street, Apt 4B</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[44px] w-[720px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.4px]">New York, NY 10001</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[77px] w-[111.162px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[56px] not-italic text-[#e95322] text-[14px] text-center top-[-0.4px]">Change Address</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-[#fef2ef] h-[114px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Paragraph5 />
      <Paragraph6 />
      <Button7 />
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-white h-[205px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[24px] relative size-full">
        <Container22 />
        <Container23 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_4005_695)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 5V10L13.3333 11.6667" id="Vector_2" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_4005_695">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[27px] relative shrink-0 w-[117.813px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[27px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.4px]">Delivery Time</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex gap-[12px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Heading7 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[167.52px] not-italic text-[#e95322] text-[16px] text-center top-[-0.6px]">ASAP</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[167.77px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.4px]">25-35 min</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#fef2ef] col-1 h-[84.2px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e95322] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[1.6px] pt-[17.6px] px-[17.6px] relative size-full">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[167.74px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-0.6px]">Scheduled</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[167.74px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.4px]">Choose time</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="col-2 h-[84.2px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[1.6px] pt-[17.6px] px-[17.6px] relative size-full">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[84.2px] relative shrink-0 w-full" data-name="Container">
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-white h-[175.2px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[24px] relative size-full">
        <Container25 />
        <Container26 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p16dd5f0} id="Vector" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 8.33333H18.3333" id="Vector_2" stroke="var(--stroke-0, #E95322)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[27px] relative shrink-0 w-[146.762px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[27px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.4px]">Payment Method</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[12px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon10 />
      <Heading8 />
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-white relative rounded-[26843500px] shrink-0 size-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[26843500px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[0.8px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] text-center">💳</p>
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#e95322] text-[16px] top-[-0.6px]">Credit/Debit Card</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.4px]">•••• 4242</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] h-[45px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#fef2ef] h-[80.2px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e95322] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17.6px] py-[1.6px] relative size-full">
          <Container30 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-white relative rounded-[26843500px] shrink-0 size-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[26843500px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[0.8px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] text-center">💰</p>
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[24px] relative shrink-0 w-[51.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[26px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-0.6px]">PayPal</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[75.2px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[17.6px] pr-[1.6px] py-[1.6px] relative size-full">
          <Container32 />
          <Paragraph13 />
        </div>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-white relative rounded-[26843500px] shrink-0 size-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[26843500px]" />
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76.575px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[38.5px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-0.6px]">Apple Pay</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="h-[75.2px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[17.6px] pr-[1.6px] py-[1.6px] relative size-full">
          <Container33 />
          <Paragraph14 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[254.6px] items-start relative shrink-0 w-full" data-name="Container">
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-white h-[345.6px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[24px] relative size-full">
        <Container28 />
        <Container29 />
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[30px] left-0 not-italic text-[#0a0a0a] text-[20px] top-[-0.6px]">Order Summary</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[24px] relative shrink-0 w-[63.35px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-0.6px]">Subtotal</p>
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[24px] relative shrink-0 w-[53.7px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.6px]">$58.96</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Paragraph15 />
        <Paragraph16 />
      </div>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[24px] relative shrink-0 w-[93.35px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-0.6px]">Delivery Fee</p>
      </div>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[24px] relative shrink-0 w-[44.2px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.6px]">$4.99</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Paragraph17 />
        <Paragraph18 />
      </div>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[24px] relative shrink-0 w-[65.713px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-0.6px]">Tax (8%)</p>
      </div>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[24px] relative shrink-0 w-[42.95px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.6px]">$4.72</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Paragraph19 />
        <Paragraph20 />
      </div>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[36px] relative shrink-0 w-[46.487px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-0 not-italic text-[#0a0a0a] text-[20px] top-[-0.6px]">Total</p>
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[36px] relative shrink-0 w-[79.2px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#e95322] text-[24px] top-[-0.8px]">$68.67</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Paragraph21 />
        <Paragraph22 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col h-[52.8px] items-start pt-[16.8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <Container40 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[172.8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-white h-[274.8px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading9 />
        <Container35 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[1792.8px] items-start left-[136px] top-[136.8px] w-[800px]" data-name="Container">
      <Container3 />
      <Container7 />
      <Container18 />
      <Container21 />
      <Container24 />
      <Container27 />
      <Container34 />
    </div>
  );
}

function Tq() {
  return (
    <div className="bg-[#f9fafb] h-[2129.6px] relative shrink-0 w-full" data-name="TQ">
      <Header />
      <Container2 />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[681.6px] items-start left-0 top-0 w-[1072px]" data-name="Body">
      <Tq />
    </div>
  );
}

function ChatgptSidebar() {
  return <div className="absolute h-0 left-0 top-[681.6px] w-[1072px]" data-name="Chatgpt-sidebar" />;
}

function Button13() {
  return (
    <div className="bg-[#e95322] h-[59px] relative rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[27px] left-[368.26px] not-italic text-[18px] text-center text-white top-[16.4px]">Place Order • $68.67</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[367.79px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.4px]">🔒 Your payment information is secure</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[124px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[32px] relative size-full">
        <Button13 />
        <Paragraph23 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[124.8px] items-start left-0 pt-[0.8px] px-[136px] top-[556.8px] w-[1072px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t-[0.8px] inset-0 pointer-events-none shadow-[0px_-4px_6px_0px_rgba(0,0,0,0.1),0px_-2px_4px_0px_rgba(0,0,0,0.06)]" />
      <Container42 />
    </div>
  );
}

export default function FoodDeliveryCheckoutFlow() {
  return (
    <div className="bg-white relative size-full" data-name="Food Delivery Checkout Flow">
      <Body />
      <ChatgptSidebar />
      <Container41 />
    </div>
  );
}
