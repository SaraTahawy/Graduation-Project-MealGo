import svgPaths from "./svg-1jt2ob3dq4";

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
    <div className="h-[30px] relative shrink-0 w-[139.05px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#101010] text-[20px] top-[-0.6px]">Manage Users</p>
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
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#878787] text-[14px]">Search users...</p>
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
    <div className="bg-[#e95322] h-[37px] relative rounded-[40px] shrink-0 w-[49.438px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[25px] not-italic text-[14px] text-center text-white top-[7.6px]">All</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f5f5f5] h-[37px] relative rounded-[40px] shrink-0 w-[98.787px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[49.5px] not-italic text-[#606060] text-[14px] text-center top-[7.6px]">Customer</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f5f5f5] h-[37px] relative rounded-[40px] shrink-0 w-[73px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[36px] not-italic text-[#606060] text-[14px] text-center top-[7.6px]">Driver</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f5f5f5] h-[37px] relative rounded-[40px] shrink-0 w-[106.175px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[53.5px] not-italic text-[#606060] text-[14px] text-center top-[7.6px]">Restaurant</p>
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
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#606060] text-[10px] top-[-0.2px]">Total</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#101010] text-[18px] top-[0.4px]">6</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white col-1 h-[71.6px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d6d6d6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[0.8px] pt-[12.8px] px-[12.8px] relative size-full">
        <Paragraph />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#606060] text-[10px] top-[-0.2px]">Customers</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#3b82f6] text-[18px] top-[0.4px]">3</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-white col-2 h-[71.6px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d6d6d6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[0.8px] pt-[12.8px] px-[12.8px] relative size-full">
        <Paragraph2 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#606060] text-[10px] top-[-0.2px]">Drivers</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#f59e0b] text-[18px] top-[0.4px]">2</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white col-3 h-[71.6px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d6d6d6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[0.8px] pt-[12.8px] px-[12.8px] relative size-full">
        <Paragraph4 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#606060] text-[10px] top-[-0.2px]">Restaurants</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#ec4899] text-[18px] top-[0.4px]">1</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white col-4 h-[71.6px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d6d6d6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[0.8px] pt-[12.8px] px-[12.8px] relative size-full">
        <Paragraph6 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[71.6px] relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[73.037px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101010] text-[16px] top-[-0.6px]">John Doe</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p14dca900} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p117fc1f0} id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#dbeafe] h-[22px] relative rounded-[12px] shrink-0 w-[85.713px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[30px] not-italic text-[#3b82f6] text-[10px] top-[3.3px]">Customer</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Text />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">john@example.com</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">+1 234 567 8901</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] h-[68px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Container15 />
        <Paragraph8 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#dcfce7] h-[26px] relative rounded-[20px] shrink-0 w-[60.9px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[12px] not-italic text-[#10b981] text-[12px] top-[3.8px]">Active</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Text1 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px] w-[98px] whitespace-pre-wrap">Joined: Jan 15, 2025</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Orders</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">45</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-0 top-0 w-[317.325px]" data-name="Container">
      <Paragraph11 />
      <Paragraph12 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Rating</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[45px] whitespace-pre-wrap">4.9 ⭐</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[325.33px] top-0 w-[317.337px]" data-name="Container">
      <Paragraph13 />
      <Paragraph14 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#f5f5f5] h-[85px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[12px] px-[12px] relative size-full">
        <Paragraph10 />
        <Container17 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/2 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
            <path d={svgPaths.p10910ff0} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[35.463px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Active</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[36px] relative shrink-0 w-[79.463px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button6 />
        <Text2 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 14.6664">
            <path d={svgPaths.p4290a20} id="Vector" stroke="var(--stroke-0, #606060)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_29.17%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_41.67%_29.17%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[20.83%] right-[20.83%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
            <path d={svgPaths.p1a1f8fc0} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.33333">
            <path d="M0.666667 0.666667H12.6667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4">
            <path d={svgPaths.p3a97aa70} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#fee2e2] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[32px] relative shrink-0 w-[72px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button7 />
        <Button8 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white h-[245px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[16px] relative size-full">
        <Container13 />
        <Container16 />
        <Container20 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[87.725px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101010] text-[16px] top-[-0.6px]">Mike Driver</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pb9add80} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M11.25 13.5H6.75" id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p27fe380} id="Vector_3" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pa40c600} id="Vector_4" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p20a8dc00} id="Vector_5" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[#fef3c7] h-[22px] relative rounded-[12px] shrink-0 w-[67.287px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon7 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[30px] not-italic text-[#f59e0b] text-[10px] top-[3.3px]">Driver</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Text3 />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">mike@example.com</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">+1 234 567 8902</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] h-[68px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Container26 />
        <Paragraph15 />
        <Paragraph16 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[#dcfce7] h-[26px] relative rounded-[20px] shrink-0 w-[60.9px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[12px] not-italic text-[#10b981] text-[12px] top-[3.8px]">Active</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Text4 />
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px] w-[99px] whitespace-pre-wrap">Joined: Feb 10, 2025</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Deliveries</p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">234</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-0 top-0 w-[317.325px]" data-name="Container">
      <Paragraph18 />
      <Paragraph19 />
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Revenue</p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[46px] whitespace-pre-wrap">$2540</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[325.33px] top-0 w-[317.337px]" data-name="Container">
      <Paragraph20 />
      <Paragraph21 />
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Rating</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[45px] whitespace-pre-wrap">4.8 ⭐</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[650.66px] top-0 w-[317.325px]" data-name="Container">
      <Paragraph22 />
      <Paragraph23 />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Container29 />
      <Container30 />
      <Container31 />
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-[#f5f5f5] h-[85px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[12px] px-[12px] relative size-full">
        <Paragraph17 />
        <Container28 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/2 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
            <path d={svgPaths.p10910ff0} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[18px] relative shrink-0 w-[35.463px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Active</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[36px] relative shrink-0 w-[79.463px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button9 />
        <Text5 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 14.6664">
            <path d={svgPaths.p4290a20} id="Vector" stroke="var(--stroke-0, #606060)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_29.17%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_41.67%_29.17%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[20.83%] right-[20.83%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
            <path d={svgPaths.p1a1f8fc0} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.33333">
            <path d="M0.666667 0.666667H12.6667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4">
            <path d={svgPaths.p3a97aa70} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[#fee2e2] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[32px] relative shrink-0 w-[72px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button10 />
        <Button11 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-white h-[245px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[16px] relative size-full">
        <Container24 />
        <Container27 />
        <Container32 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[133.5px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101010] text-[16px] top-[-0.6px]">Sarah Restaurant</p>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p7970380} id="Vector" stroke="var(--stroke-0, #EC4899)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3aeeac00} id="Vector_2" stroke="var(--stroke-0, #EC4899)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.peb7c400} id="Vector_3" stroke="var(--stroke-0, #EC4899)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="bg-[#fce7f3] h-[22px] relative rounded-[12px] shrink-0 w-[90.988px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon11 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[30px] not-italic text-[#ec4899] text-[10px] top-[3.3px]">Restaurant</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Text6 />
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">sarah@example.com</p>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">+1 234 567 8903</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="flex-[1_0_0] h-[68px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Container38 />
        <Paragraph24 />
        <Paragraph25 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="bg-[#dcfce7] h-[26px] relative rounded-[20px] shrink-0 w-[60.9px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[12px] not-italic text-[#10b981] text-[12px] top-[3.8px]">Active</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Text7 />
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px] w-[95px] whitespace-pre-wrap">Joined: Mar 5, 2025</p>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Orders</p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">1234</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-0 top-0 w-[317.325px]" data-name="Container">
      <Paragraph27 />
      <Paragraph28 />
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Revenue</p>
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[59px] whitespace-pre-wrap">$45,230</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[325.33px] top-0 w-[317.337px]" data-name="Container">
      <Paragraph29 />
      <Paragraph30 />
    </div>
  );
}

function Paragraph31() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Rating</p>
    </div>
  );
}

function Paragraph32() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[44px] whitespace-pre-wrap">4.7 ⭐</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[650.66px] top-0 w-[317.325px]" data-name="Container">
      <Paragraph31 />
      <Paragraph32 />
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Container41 />
      <Container42 />
      <Container43 />
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-[#f5f5f5] h-[85px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[12px] px-[12px] relative size-full">
        <Paragraph26 />
        <Container40 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/2 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
            <path d={svgPaths.p10910ff0} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[18px] relative shrink-0 w-[35.463px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Active</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[36px] relative shrink-0 w-[79.463px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button12 />
        <Text8 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 14.6664">
            <path d={svgPaths.p4290a20} id="Vector" stroke="var(--stroke-0, #606060)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_29.17%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_41.67%_29.17%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[20.83%] right-[20.83%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
            <path d={svgPaths.p1a1f8fc0} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.33333">
            <path d="M0.666667 0.666667H12.6667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4">
            <path d={svgPaths.p3a97aa70} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-[#fee2e2] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[32px] relative shrink-0 w-[72px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button13 />
        <Button14 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container45 />
      <Container46 />
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-white h-[245px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[16px] relative size-full">
        <Container36 />
        <Container39 />
        <Container44 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[121.938px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101010] text-[16px] top-[-0.6px]">Emily Customer</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p14dca900} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p117fc1f0} id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="bg-[#dbeafe] h-[22px] relative rounded-[12px] shrink-0 w-[85.713px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon15 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[30px] not-italic text-[#3b82f6] text-[10px] top-[3.3px]">Customer</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Text9 />
    </div>
  );
}

function Paragraph33() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">emily@example.com</p>
    </div>
  );
}

function Paragraph34() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">+1 234 567 8904</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="flex-[1_0_0] h-[68px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Container50 />
        <Paragraph33 />
        <Paragraph34 />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="bg-[#dcfce7] h-[26px] relative rounded-[20px] shrink-0 w-[60.9px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[12px] not-italic text-[#10b981] text-[12px] top-[3.8px]">Active</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container49 />
      <Text10 />
    </div>
  );
}

function Paragraph35() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px] w-[99px] whitespace-pre-wrap">Joined: Apr 20, 2025</p>
    </div>
  );
}

function Paragraph36() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Orders</p>
    </div>
  );
}

function Paragraph37() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">12</p>
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-0 top-0 w-[317.325px]" data-name="Container">
      <Paragraph36 />
      <Paragraph37 />
    </div>
  );
}

function Paragraph38() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Rating</p>
    </div>
  );
}

function Paragraph39() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[32px] whitespace-pre-wrap">5 ⭐</p>
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[325.33px] top-0 w-[317.337px]" data-name="Container">
      <Paragraph38 />
      <Paragraph39 />
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container51() {
  return (
    <div className="bg-[#f5f5f5] h-[85px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[12px] px-[12px] relative size-full">
        <Paragraph35 />
        <Container52 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/2 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
            <path d={svgPaths.p10910ff0} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[18px] relative shrink-0 w-[35.463px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Active</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[36px] relative shrink-0 w-[79.463px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button15 />
        <Text11 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 14.6664">
            <path d={svgPaths.p4290a20} id="Vector" stroke="var(--stroke-0, #606060)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_29.17%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_41.67%_29.17%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[20.83%] right-[20.83%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
            <path d={svgPaths.p1a1f8fc0} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.33333">
            <path d="M0.666667 0.666667H12.6667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4">
            <path d={svgPaths.p3a97aa70} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div className="bg-[#fee2e2] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[32px] relative shrink-0 w-[72px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button16 />
        <Button17 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-white h-[245px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[16px] relative size-full">
        <Container48 />
        <Container51 />
        <Container55 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[90.063px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101010] text-[16px] top-[-0.6px]">Tom Wilson</p>
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pb9add80} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M11.25 13.5H6.75" id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p27fe380} id="Vector_3" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pa40c600} id="Vector_4" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p20a8dc00} id="Vector_5" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="bg-[#fef3c7] h-[22px] relative rounded-[12px] shrink-0 w-[67.287px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon19 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[30px] not-italic text-[#f59e0b] text-[10px] top-[3.3px]">Driver</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Text12 />
    </div>
  );
}

function Paragraph40() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">tom@example.com</p>
    </div>
  );
}

function Paragraph41() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">+1 234 567 8905</p>
    </div>
  );
}

function Container60() {
  return (
    <div className="flex-[1_0_0] h-[68px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Container61 />
        <Paragraph40 />
        <Paragraph41 />
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="bg-[#f0f0f0] h-[26px] relative rounded-[20px] shrink-0 w-[69.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[12px] not-italic text-[#606060] text-[12px] top-[3.8px]">Inactive</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container60 />
      <Text13 />
    </div>
  );
}

function Paragraph42() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px] w-[101px] whitespace-pre-wrap">Joined: May 12, 2025</p>
    </div>
  );
}

function Paragraph43() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Deliveries</p>
    </div>
  );
}

function Paragraph44() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">56</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-0 top-0 w-[317.325px]" data-name="Container">
      <Paragraph43 />
      <Paragraph44 />
    </div>
  );
}

function Paragraph45() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Revenue</p>
    </div>
  );
}

function Paragraph46() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[37px] whitespace-pre-wrap">$680</p>
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[325.33px] top-0 w-[317.337px]" data-name="Container">
      <Paragraph45 />
      <Paragraph46 />
    </div>
  );
}

function Paragraph47() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Rating</p>
    </div>
  );
}

function Paragraph48() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[45px] whitespace-pre-wrap">4.5 ⭐</p>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[650.66px] top-0 w-[317.325px]" data-name="Container">
      <Paragraph47 />
      <Paragraph48 />
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Container64 />
      <Container65 />
      <Container66 />
    </div>
  );
}

function Container62() {
  return (
    <div className="bg-[#f5f5f5] h-[85px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[12px] px-[12px] relative size-full">
        <Paragraph42 />
        <Container63 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #878787)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
            <path d={svgPaths.p10910ff0} id="Vector" stroke="var(--stroke-0, #878787)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Inactive</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="h-[36px] relative shrink-0 w-[88.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button18 />
        <Text14 />
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 14.6664">
            <path d={svgPaths.p4290a20} id="Vector" stroke="var(--stroke-0, #606060)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button19() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon21 />
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_29.17%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_41.67%_29.17%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[20.83%] right-[20.83%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
            <path d={svgPaths.p1a1f8fc0} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.33333">
            <path d="M0.666667 0.666667H12.6667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4">
            <path d={svgPaths.p3a97aa70} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="bg-[#fee2e2] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[32px] relative shrink-0 w-[72px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button19 />
        <Button20 />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container68 />
      <Container69 />
    </div>
  );
}

function Container58() {
  return (
    <div className="bg-white h-[245px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[16px] relative size-full">
        <Container59 />
        <Container62 />
        <Container67 />
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[91.763px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101010] text-[16px] top-[-0.6px]">Alice Brown</p>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p14dca900} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p117fc1f0} id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="bg-[#dbeafe] h-[22px] relative rounded-[12px] shrink-0 w-[85.713px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon23 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[30px] not-italic text-[#3b82f6] text-[10px] top-[3.3px]">Customer</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading6 />
      <Text15 />
    </div>
  );
}

function Paragraph49() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">alice@example.com</p>
    </div>
  );
}

function Paragraph50() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">+1 234 567 8906</p>
    </div>
  );
}

function Container72() {
  return (
    <div className="flex-[1_0_0] h-[68px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Container73 />
        <Paragraph49 />
        <Paragraph50 />
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="bg-[#fee2e2] h-[26px] relative rounded-[20px] shrink-0 w-[89.85px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[12px] not-italic text-[#ef4444] text-[12px] top-[3.8px]">Suspended</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container72 />
      <Text16 />
    </div>
  );
}

function Paragraph51() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px] w-[94px] whitespace-pre-wrap">Joined: Jun 8, 2025</p>
    </div>
  );
}

function Paragraph52() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Orders</p>
    </div>
  );
}

function Paragraph53() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px]">3</p>
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-0 top-0 w-[317.325px]" data-name="Container">
      <Paragraph52 />
      <Paragraph53 />
    </div>
  );
}

function Paragraph54() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#878787] text-[10px] top-[-0.2px]">Rating</p>
    </div>
  );
}

function Paragraph55() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101010] text-[14px] top-[-0.4px] w-[45px] whitespace-pre-wrap">3.2 ⭐</p>
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[38px] items-start left-[325.33px] top-0 w-[317.337px]" data-name="Container">
      <Paragraph54 />
      <Paragraph55 />
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Container76 />
      <Container77 />
    </div>
  );
}

function Container74() {
  return (
    <div className="bg-[#f5f5f5] h-[85px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[12px] px-[12px] relative size-full">
        <Paragraph51 />
        <Container75 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #878787)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
            <path d={svgPaths.p10910ff0} id="Vector" stroke="var(--stroke-0, #878787)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#606060] text-[12px] top-[-0.2px]">Suspended</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[36px] relative shrink-0 w-[108.113px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button21 />
        <Text17 />
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 14.6664">
            <path d={svgPaths.p4290a20} id="Vector" stroke="var(--stroke-0, #606060)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_29.17%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_41.67%_29.17%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
            <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[20.83%] right-[20.83%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
            <path d={svgPaths.p1a1f8fc0} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.33333">
            <path d="M0.666667 0.666667H12.6667" id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4">
            <path d={svgPaths.p3a97aa70} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="bg-[#fee2e2] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon26 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[32px] relative shrink-0 w-[72px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button22 />
        <Button23 />
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container79 />
      <Container80 />
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-white h-[245px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[16px] px-[16px] relative size-full">
        <Container71 />
        <Container74 />
        <Container78 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[1550px] items-start relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Container23 />
      <Container35 />
      <Container47 />
      <Container58 />
      <Container70 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[1669.6px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[24px] px-[24px] relative size-full">
        <Container6 />
        <Container11 />
      </div>
    </div>
  );
}

function PQ() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col h-[2015.6px] items-start relative shrink-0 w-full" data-name="pQ">
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

function Container82() {
  return <div className="bg-[#101010] h-[5px] rounded-[100px] shrink-0 w-full" data-name="Container" />;
}

function Container81() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[34px] items-start left-0 pt-[21px] px-[469px] top-[647.6px] w-[1072px]" data-name="Container">
      <Container82 />
    </div>
  );
}

export default function FoodOrderingWebsite() {
  return (
    <div className="bg-white relative size-full" data-name="Food Ordering Website">
      <Body />
      <ChatgptSidebar />
      <Container81 />
    </div>
  );
}