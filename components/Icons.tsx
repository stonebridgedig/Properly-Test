
import React from 'react';

export const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    {children}
  </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></IconWrapper>
);

export const Bars3Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </IconWrapper>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </IconWrapper>
);

export const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
  </IconWrapper>
);

export const BuildingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6" />
  </IconWrapper>
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </IconWrapper>
);

export const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </IconWrapper>
);

export const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></IconWrapper>
);

export const DollarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659 1.172 0 2.24.879 2.24 2.24v.001" /></IconWrapper>
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></IconWrapper>
);

export const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.5-2.25 2.5h-10.5A2.25 2.25 0 015.25 18.225V14.15m15 0v-1.8a2.25 2.25 0 00-2.25-2.25h-10.5A2.25 2.25 0 005.25 12.35v1.8m15 0a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v5.4A2.25 2.25 0 004.5 14.45m15-9.3l-3.86-3.86A2.25 2.25 0 0014.213 1.5H9.787a2.25 2.25 0 00-1.591.64L4.5 5.15" /></IconWrapper>
);

export const WrenchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a2.652 2.652 0 000-3.753l-2.471-2.471a2.652 2.652 0 00-3.753 0L3 11.42a2.652 2.652 0 000 3.753l2.471 2.471a2.652 2.652 0 003.753 0z" /></IconWrapper>
);

export const MegaphoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9.75 0h4.5M2.25 3h1.342c.81 0 1.523.596 1.733 1.383l.84 3.151C6.42 8.742 7.36 9.375 8.406 9.375h5.188c1.046 0 1.986-.633 2.288-1.642l.84-3.151c.21-.787.923-1.383 1.732-1.383h1.342" /></IconWrapper>
);

export const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m3.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></IconWrapper>
);

export const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.002 1.112-1.112l.083-.021c.241-.05.485-.098.732-.143l.25-.042c.623-.105 1.282.17 1.635.733l.05.096a8.25 8.25 0 011.233 2.193l.02.046c.158.337.494.557.87.557l.55.002c.61.002 1.141.42 1.332.992l.03.091a8.25 8.25 0 01-1.233 2.193l-.02.046c-.158.337-.494.557-.87.557l-.55.002c-.61.002-1.141.42-1.332.992l-.03.091a8.25 8.25 0 01-2.193 1.233l-.046.02c-.337.158-.557.494-.557.87l-.002.55c-.002-.61.42-1.141.992-1.332l.091.03a8.25 8.25 0 01-2.193 1.233c-1.328.714-2.86.37-3.951-.81l-.034-.034a8.25 8.25 0 01-1.233-2.193l-.02-.046a1.423 1.423 0 00-.557-.87l-.55-.002a1.5 1.5 0 00-.992 1.332c-.01.242-.016.486-.021.732l-.042.25c-.623.105-1.282-.17-1.635-.733l-.05-.096a8.25 8.25 0 01-1.233-2.193l-.02-.046c-.158-.337-.494-.557-.87-.557l-.55.002zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>
);

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></IconWrapper>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></IconWrapper>
);

export const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></IconWrapper>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></IconWrapper>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></IconWrapper>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></IconWrapper>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></IconWrapper>
);

export const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconWrapper>
);

export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconWrapper>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></IconWrapper>
);

export const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconWrapper>
);

export const EllipsisVerticalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></IconWrapper>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.913 3.75 6 4.704 6 5.884v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></IconWrapper>
);

export const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-12V9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 9V5.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25m-6 0v-2.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25m10.5 6h.008v.008h-.008v-.008zm0 0h.008v.008h-.008v-.008zm0 0h.008v.008h-.008v-.008zm-4.5 0h.008v.008h-.008v-.008z" /></IconWrapper>
);

export const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></IconWrapper>
);

export const ZillowIcon: React.FC<{ className?: string }> = ({ className }) => (<svg viewBox="0 0 256 256" className={className}><path fill="#1277e1" d="M128 3.515C60.203 3.515 5.375 58.344 5.375 126.138c0 33.805 15.013 63.88 38.625 84.155l165.657-96.652C200.758 53.018 167.925 3.515 128 3.515z"/><path fill="#fff" d="M162.77 151.722L55.57 212.894c16.353 15.532 38.835 25.138 64.055 26.687V155.19c0-2.096 1.701-3.797 3.797-3.797h39.348z"/></svg>);
export const TruliaIcon: React.FC<{ className?: string }> = ({ className }) => (<svg viewBox="0 0 24 24" className={className}><path fill="#53b544" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h8.5v8z"/><path fill="#fff" d="M15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>);
export const ApartmentsIcon: React.FC<{ className?: string }> = ({ className }) => (<svg viewBox="0 0 24 24" className={className}><path fill="#97259a" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></IconWrapper>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></IconWrapper>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></IconWrapper>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></IconWrapper>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>
);

export const StarIcon: React.FC<{ className?: string, filled?: boolean }> = ({ className, filled = true }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.408c.492 0 .691.646.341.986l-4.402 3.203a.563.563 0 00-.18.635l1.63 5.437c.143.474-.374.833-.786.536L12 17.514l-4.389 2.597c-.412.297-.929-.062-.786-.536l1.63-5.437a.563.563 0 00-.18-.635l-4.402-3.203c-.35-.34-.15-.986.341-.986h5.408a.563.563 0 00.475-.31L11.48 3.5z" style={{ fill: filled ? 'currentColor' : 'none' }} />
    </IconWrapper>
);

export const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-3.375A4.5 4.5 0 009 13.5h-3a4.5 4.5 0 00-4.5 4.5V21m4.5-3.375h6.75A4.5 4.5 0 0021 13.5h-3a4.5 4.5 0 00-4.5 4.5V21m-3.375-13.5L12 1.5m0 3.375L15.375 1.5M9 1.5l3.375 3.375m0 0L15.375 1.5M3 8.25v9.75a3 3 0 003 3h12a3 3 0 003-3V8.25" /></IconWrapper>
);

export const PinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75v16.5L12 16.5l-4.5 3.75V3.75m17.25 4.5a2.25 2.25 0 01-2.25 2.25H3.75a2.25 2.25 0 01-2.25-2.25V5.25a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v2.25z" /></IconWrapper>
);

export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></IconWrapper>
);

export const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></IconWrapper>
);

export const QuickBooksIcon: React.FC<{ className?: string }> = ({ className }) => (<svg viewBox="0 0 24 24" className={className}><path fill="#2ca01c" d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2.5 13.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/><path fill="#fff" d="M9.5 14.5a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z"/><path fill="#2ca01c" d="M16 8.5A1.5 1.5 0 0014.5 7H9.5A1.5 1.5 0 008 8.5v4A1.5 1.5 0 009.5 14h5a1.5 1.5 0 001.5-1.5v-4z"/></svg>);
export const XeroIcon: React.FC<{ className?: string }> = ({ className }) => (<svg viewBox="0 0 24 24" className={className}><circle cx="12" cy="12" r="10" fill="#1976d2"/><path fill="#fff" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>);

export const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5a7.5 7.5 0 11-7.5-14.13" />
    </IconWrapper>
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const IdCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3m-3 4.5h3m-6-8.25h.008v.008H9v-.008zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25v9a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 8.25z" /></IconWrapper>
);

export const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.492v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.667 0l-3.181 3.183" /></IconWrapper>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></IconWrapper>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></IconWrapper>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></IconWrapper>
);

export const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></IconWrapper>
);

export const Squares2X2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </IconWrapper>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></IconWrapper>
);

export const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></IconWrapper>
);

export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></IconWrapper>
);

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></IconWrapper>
);
