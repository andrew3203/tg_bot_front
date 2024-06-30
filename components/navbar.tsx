'use client';

import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-slate-700 px-4 py-8 flex items-center justify-between text-white fixed w-full top-0 left-0">
            <Link href="/" className='text-2xl'>
                Portobello Bot
            </Link>
            <ul className="flex space-x-6">
                <li>
                    <Link href="/users">
                        Пользователи
                    </Link>
                </li>
                <li>
                    <Link href="/messages">
                        Сообщения
                    </Link>
                </li>
                <li>
                    <Link href="/actions">
                        Действия
                    </Link>
                </li>
                <li>
                    <Link href="/mailings">
                        Рассылки
                    </Link>
                </li>
                <li>
                    <Link href="/groups">
                        Группы
                    </Link>
                </li>
                <li>
                    <Link href="/responses">
                        Ответы
                    </Link>
                </li>
                <li>
                    <Link href="/login">
                        Войти
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
