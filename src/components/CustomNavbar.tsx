import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { useUser } from './UserContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CustomNavbar(props: any) {
    const { signOut } = props;
    const { username } = useUser();

  return (
    <>
    <Navbar isBordered>
      <NavbarBrand>
        <Link href="/">
        <p className="font-bold text-inherit text-3xl font-mono" >TopicTribe</p>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {username}
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" variant="flat" onClick={signOut}>
            Sign Out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </>
  );
}
