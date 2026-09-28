import svgPaths from "./svg-x0r2v2oplo";

function Container() {
  return <div className="bg-white h-[44px] shrink-0 w-full" data-name="Container" />;
}

function Icon() {
  return (
    <div className="h-[24px] relative shrink-0 w-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 24">
        <g id="Icon">
          <path d="M12.5 17L7.5 12L12.5 7" id="Vector" stroke="var(--stroke-0, #101010)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[12px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[30px] relative shrink-0 w-[199.413px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#101010] text-[20px] top-[-0.6px]">Manage Restaurants</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 4.16667V15.8333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#e95322] relative rounded-[12px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Button />
      <Heading />
      <Button1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M15.75 15.75L12.495 12.495" id="Vector" stroke="var(--stroke-0, #878787)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p126da180} id="Vector_2" stroke="var(--stroke-0, #878787)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#878787] text-[14px]">Search restaurants...</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#f5f5f5] h-[45px] relative rounded-[40px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[16px] relative size-full">
          <Icon2 />
          <TextInput />
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f5f5f5] h-[37px] relative rounded-[40px] shrink-0 w-[49.438px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[25px] not-italic text-[#606060] text-[14px] text-center top-[7.6px]">All</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f5f5f5] h-[37px] relative rounded-[40px] shrink-0 w-[75.05px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[38px] not-italic text-[#606060] text-[14px] text-center top-[7.6px]">Active</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f5f5f5] h-[37px] relative rounded-[40px] shrink-0 w-[85.588px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[43px] not-italic text-[#606060] text-[14px] text-center top-[7.6px]">Inactive</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#e95322] h-[37px] relative rounded-[40px] shrink-0 w-[87.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[44px] not-italic text-[14px] text-center text-white top-[7.6px]">Pending</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[45px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white h-[202px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[20px] px-[24px] relative size-full">
        <Container2 />
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Total</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#101010] text-[20px] top-[-0.6px]">5</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[4px] h-[77.6px] items-start left-0 pb-[0.8px] pt-[12.8px] px-[12.8px] rounded-[12px] top-0 w-[333.325px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d6d6d6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Active</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#10b981] text-[20px] top-[-0.6px]">2</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[4px] h-[77.6px] items-start left-[345.33px] pb-[0.8px] pt-[12.8px] px-[12.8px] rounded-[12px] top-0 w-[333.337px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d6d6d6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Pending</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#f59e0b] text-[20px] top-[-0.6px]">1</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[4px] h-[77.6px] items-start left-[690.66px] pb-[0.8px] pt-[12.8px] px-[12.8px] rounded-[12px] top-0 w-[333.325px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d6d6d6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[77.6px] relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
      <Container9 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[126.65px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101010] text-[16px] top-[-0.6px]">New Pizza Place</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center left-0 top-0 w-[920.425px]" data-name="Container">
      <Heading1 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[18px] left-0 top-[28px] w-[920.425px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px] w-[109px] whitespace-pre-wrap">Owner: Emily Davis</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[18px] left-0 top-[48px] w-[920.425px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">emily@pizza.com</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[18px] left-0 top-[68px] w-[920.425px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">+1 234 567 8904</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] h-[86px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container13 />
        <Paragraph6 />
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#fef3c7] h-[26px] relative rounded-[20px] shrink-0 w-[71.575px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[12px] not-italic text-[#f59e0b] text-[12px] top-[3.8px]">Pending</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[86px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Container12 />
        <Text />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px] w-[148px] whitespace-pre-wrap">📍 Jl. Veteran 23, Jakarta</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Orders</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">0</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-0 top-0 w-[317.325px]" data-name="Container">
      <Paragraph10 />
      <Paragraph11 />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Revenue</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[19px] whitespace-pre-wrap">$0</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[325.33px] top-0 w-[317.337px]" data-name="Container">
      <Paragraph12 />
      <Paragraph13 />
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Rating</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">N/A</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[650.66px] top-0 w-[317.325px]" data-name="Container">
      <Paragraph14 />
      <Paragraph15 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#f5f5f5] h-[88px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[12px] px-[12px] relative size-full">
        <Paragraph9 />
        <Container15 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#10b981] flex-[1_0_0] h-[44.2px] min-h-px min-w-px relative rounded-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[245.59px] not-italic text-[14px] text-center text-white top-[11.2px]">Approve</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="flex-[1_0_0] h-[44.2px] min-h-px min-w-px relative rounded-[40px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#ef4444] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[40px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[246.97px] not-italic text-[#ef4444] text-[14px] text-center top-[11.2px]">Reject</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[8px] h-[44.2px] items-start relative shrink-0 w-full" data-name="Container">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[274.2px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[16px] relative size-full">
        <Container11 />
        <Container14 />
        <Container19 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[399.8px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[24px] px-[24px] relative size-full">
        <Container6 />
        <Container10 />
      </div>
    </div>
  );
}

function PQ() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col h-[745.8px] items-start relative shrink-0 w-full" data-name="pQ">
      <Container />
      <Container1 />
      <Container5 />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[681.6px] items-start left-0 top-0 w-[1072px]" data-name="Body">
      <PQ />
    </div>
  );
}

function ChatgptSidebar() {
  return <div className="absolute h-0 left-0 top-[681.6px] w-[1072px]" data-name="Chatgpt-sidebar" />;
}

function Container21() {
  return <div className="bg-[#101010] h-[5px] rounded-[100px] shrink-0 w-full" data-name="Container" />;
}

function Container20() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[34px] items-start left-0 pt-[21px] px-[469px] top-[647.6px] w-[1072px]" data-name="Container">
      <Container21 />
    </div>
  );
}

export default function FoodOrderingWebsite() {
  return (
    <div className="bg-white relative size-full" data-name="Food Ordering Website">
      <Body />
      <ChatgptSidebar />
      <Container20 />
    </div>
  );
}