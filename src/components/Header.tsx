import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/logo.svg'; // Assuming the logo is in .png format

const Header = () => {
  return (
    <header className="bg-white shadow-md py-6"> {/* Increased padding to make the header larger */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src={logo}
            alt="Lumino Logo"
            width={160}         // Increase the logo size if needed
            height={50}         // Adjust the height accordingly
            priority
          />
        </Link>
        <nav className="flex space-x-8"> {/* Adjust space between links */}
          <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 text-lg"> {/* Increase text size */}
            Dashboard
          </Link>
          <Link href="/docs" className="text-gray-600 hover:text-purple-600 text-lg"> {/* Increase text size */}
            Docs
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;