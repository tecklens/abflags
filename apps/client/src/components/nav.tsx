import { Link } from 'react-router-dom';
import { IconBike, IconChevronDown, IconCircle } from '@tabler/icons-react';
import { Button, buttonVariants } from './custom/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '@client/lib/utils';
import useCheckActiveNav from '@client/hooks/use-check-active-nav';
import { SideLink } from '@client/data/sidelinks';
import React, { useEffect } from 'react';
import { useUser } from '@client/lib/store/userStore';
import { Tabs, TabsList, TabsTrigger } from '@client/components/ui/tabs';
import { useEnv } from '@client/lib/store/envStore';
import { throttle } from 'lodash';
import { useProject } from '@client/lib/store/projectStore';
import {useAuth} from "@client/context/auth";

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  links: SideLink[];
  closeNav: () => void;
  open: boolean;
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
  open,
}: NavProps) {
  const {token} = useAuth()
  const { env, envs } = useEnv((state) => state);
  const switchEnv = useUser((state) => state.switchEnv);
  const { activeProject, fetchActiveProject, setOpenSelectProject } =
    useProject();

  const switchEnvThrottle = throttle(switchEnv, 100);

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    fetchActiveProject();
  }, [fetchActiveProject, token]);
  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.title}-${rest.href}`;
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      );

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />;

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      );

    return <NavLink {...rest} key={key} closeNav={closeNav} />;
  };
  return (
    <div
      data-collapsed={open && isCollapsed}
      className={cn(
        'group border-b bg-background py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none',
        className,
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className="h-full group-[[data-collapsed=true]]:h-full gap-1 flex flex-col group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          <div className={'p-3'}>
            {activeProject ? (
              <Button
                variant={'outline'}
                className={'w-full'}
                onClick={() => setOpenSelectProject(true)}
              >
                {activeProject?.name}
              </Button>
            ) : (
              <Button
                variant={'outline'}
                className={'w-full'}
                onClick={() => setOpenSelectProject(true)}
              >
                Select project
              </Button>
            )}
          </div>
          <div className={'flex flex-col gap-1 flex-1'}>
            {links.map(renderLink)}
          </div>
          <Link
            to={'/get-started'}
            className={`${isCollapsed || !envs ? 'hidden' : 'block'}`}
          >
            <div
              className={
                'flex space-x-1 py-2 px-3 items-center cursor-pointer hover:text-green-600 w-full'
              }
            >
              <IconBike size={18} />
              <div className={'text-sm flex-1'}>Get Started</div>
              <div
                className={'flex space-x-1 text-green-700 dark:text-green-500'}
              >
                <IconCircle size={8} />
                <IconCircle size={8} />
                <IconCircle size={8} />
                <IconCircle size={8} />
              </div>
            </div>
          </Link>
          <Tabs
            value={env?._id}
            onValueChange={switchEnvThrottle}
            className={`w-full p-2 ${isCollapsed || !envs ? 'hidden' : 'block'}`}
          >
            <TabsList className="env-switcher grid w-full grid-cols-2">
              {envs
                ? envs.map((e) => (
                    <TabsTrigger value={e._id} key={e._id}>
                      {e.name} MODE
                    </TabsTrigger>
                  ))
                : null}
            </TabsList>
          </Tabs>
        </nav>
      </TooltipProvider>
    </div>
  );
}

interface NavLinkProps extends SideLink {
  subLink?: boolean;
  closeNav: () => void;
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  return (
    <Link
      to={href ?? '#'}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: checkActiveNav(href ?? '#') ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-12 justify-start text-wrap rounded-none px-6',
        subLink && 'h-10 w-full border-l border-l-slate-500 px-2',
      )}
      aria-current={checkActiveNav(href ?? '#') ? 'page' : undefined}
    >
      <div className="mr-2">{icon}</div>
      {title}
      {label && (
        <div className="ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground">
          {label}
        </div>
      )}
    </Link>
  );
}

function NavLinkDropdown({ title, icon, label, sub, closeNav }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href ?? '#'));

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-12 w-full justify-start rounded-none px-6',
        )}
      >
        <div className="mr-2">{icon}</div>
        {title}
        {label && (
          <div className="ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground">
            {label}
          </div>
        )}
        <span
          className={cn(
            'ml-auto transition-all group-data-[state="open"]:-rotate-180',
          )}
        >
          <IconChevronDown stroke={1} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="collapsibleDropdown" asChild>
        <ul>
          {sub?.map((sublink) => (
            <li key={sublink.title} className="my-1 ml-8">
              <NavLink {...sublink} subLink closeNav={closeNav} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavLinkIcon({ title, icon, label, href }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={href ?? '#'}
          className={cn(
            buttonVariants({
              variant: checkActiveNav(href ?? '#') ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            'h-12 w-12',
          )}
        >
          {icon}
          <span className="sr-only">{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {title}
        {label && (
          <span className="ml-auto text-muted-foreground">{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function NavLinkIconDropdown({ title, icon, label, sub }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href ?? '#'));

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isChildActive ? 'secondary' : 'ghost'}
              size="icon"
              className="h-12 w-12"
            >
              {icon}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {title}{' '}
          {label && (
            <span className="ml-auto text-muted-foreground">{label}</span>
          )}
          <IconChevronDown
            size={18}
            className="-rotate-90 text-muted-foreground"
          />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="right" align="start" sideOffset={4}>
        <DropdownMenuLabel>
          {title} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub?.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link
              to={href ?? '#'}
              className={`${checkActiveNav(href ?? '#') ? 'bg-secondary' : ''}`}
            >
              {icon} <span className="ml-2 max-w-52 text-wrap">{title}</span>
              {label && <span className="ml-auto text-xs">{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
