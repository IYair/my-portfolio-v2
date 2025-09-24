import Image from "next/image";
import {
  UserIcon,
  BriefcaseIcon,
  TrophyIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";

type Skill = {
  name: string;
  icon: string;
};

type Contact = {
  icon: string;
  data: string;
  heroicon?: boolean;
  heroiconComponent?: React.ReactElement;
};

const skills: Skill[] = [
  { name: 'HTML', icon: '/icons/Html.svg' },
  { name: 'CSS', icon: '/icons/Css.svg' },
  { name: 'Javascript', icon: '/icons/logo-javascript.svg' },
  { name: 'Typescript', icon: '/icons/devicon_typescript.svg' },
  { name: 'React js', icon: '/icons/React.svg' },
  { name: 'Next js', icon: '/icons/Nextjs-white.svg' },
  { name: 'Node js', icon: '/icons/vscode-icons_file-type-node.svg' },
  { name: 'Docker', icon: '/icons/logo-docker.svg' },
  { name: 'Postman', icon: '/icons/devicon_postman.svg' },
  { name: 'Tailwind CSS', icon: '/icons/devicon_tailwindcss.svg' },
  { name: 'MySQL', icon: '/icons/devicon_mysql.svg' },
  { name: 'Prisma', icon: '/icons/devicon_prisma.svg' },
  { name: 'Redux', icon: '/icons/devicon_redux.svg' },
  { name: 'Git', icon: '/icons/devicon_git.svg' },
  { name: 'Figma', icon: '/icons/logos_figma.svg' },
  { name: 'Selenium', icon: '/icons/skill-icons_selenium.svg' },
  { name: 'Sass', icon: '/icons/logos_sass.svg' },
  { name: 'Jest', icon: '/icons/skill-icons_jest.svg' },
];

const contacts: Contact[] = [
  {
    icon: '/icons/flag-mexico.svg',
    data: 'Campeche, Mexico',
    heroicon: false
  },
  {
    icon: '',
    data: '+52 981-178-50-39',
    heroiconComponent: <DevicePhoneMobileIcon className='w-9 h-auto ml-8 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] text-white' />,
    heroicon: true
  },
  {
    icon: '',
    heroiconComponent: <EnvelopeIcon className='w-9 h-auto ml-8 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] text-white' />,
    data: 'enyaoficial001@gmail.com',
    heroicon: true
  },
  {
    icon: '/icons/icon-linkedin.svg',
    data: 'www.linkedin.com/in/yair-chan',
    heroicon: false
  },
  {
    icon: '/icons/github.svg',
    data: 'github.com/IYair',
    heroicon: false
  }
];

export default function About() {
  return (
    <div className="min-h-screen" style={{
      backgroundImage: 'url(/images/NoiseTexture.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className='grid grid-cols-1 lg:grid-cols-3 h-screen w-full px-4 lg:px-40 py-24 rounded-2xl gap-14 overflow-y-scroll'>
        {/* Left Section */}
        <section id='sideLeft' className='flex flex-col col-span-1 lg:col-span-1'>
          <div className='relative aspect-[9/16] h-[650px]'>
            <Image
              src='/images/me.png'
              alt='Imagen de perfil'
              fill
              sizes='100%'
              priority
              style={{ objectFit: 'cover' }}
              className='rounded-2xl'
            />
            <div className='absolute bottom-[6%] left-[15%] flex flex-col h-auto w-3/4 items-center backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg' style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}>
              <h1 className='text-white text-2xl font-bold mt-4 tracking-[0.2em] block text-center'>
                YAIR CHAN
              </h1>
              <div className='flex w-full items-start justify-center'>
                <div className='flex-1 h-px mt-2 bg-gradient-to-r from-transparent to-white'></div>
                <h2 className='text-white font-thin mb-4 px-4 text-center tracking-widest whitespace-nowrap'>
                  SOFTWARE DEVELOPER
                </h2>
                <div className='flex-1 h-px mt-2 bg-gradient-to-l from-transparent to-white'></div>
              </div>
            </div>
          </div>

          <div className='mt-10'>
            <h2 className='flex text-white font-thin m-3 text-2xl lg:text-3xl items-center'>
              <TrophyIcon className='w-10 h-auto mr-4 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]' />
              HABILIDADES TÉCNICAS
            </h2>
            <div className='grid grid-cols-4 gap-4 mt-10'>
              {skills.map((skill, index) => (
                <div key={index} className='flex flex-col items-center'>
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    height={64}
                    width={64}
                    className='w-16 h-16'
                  />
                  <p className='text-white text-center font-thin text-sm'>
                    {skill.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-10'>
            <h2 className='flex text-white font-thin m-3 text-2xl lg:text-3xl items-center'>
              <RocketLaunchIcon className='w-10 h-auto mr-4 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]' />
              CONTACTAME
            </h2>
            <div className='flex flex-col space-y-6'>
              {contacts.map((contact, index) => (
                <div key={index} className='flex flex-row items-center'>
                  {contact.heroicon ? (
                    <>{contact.heroiconComponent}</>
                  ) : (
                    <Image
                      src={contact.icon}
                      alt={contact.data}
                      width={24}
                      height={24}
                      className='w-8 h-auto ml-8'
                    />
                  )}
                  <p className='text-white text-justify font-thin ml-2'>
                    {contact.data}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className='flex flex-col flex-nowrap p-4 col-span-1 lg:col-span-2 bg-white rounded-2xl'>
          <h2 className='flex text-blue-900 font-bold m-3 text-2xl lg:text-3xl items-center'>
            <UserIcon className='w-10 h-auto mr-4 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]' />
            SOBRE MI
          </h2>
          <h3 className='text-blue-900 m-3 text-xl'>
            Software Developer | Web Developer | Full Stack Developer
          </h3>
          <p className='text-blue-900 text-justify m-3 pr-10'>
            Como profesional en tecnologías web y desarrollo de software, me destaco por mi pasión por la innovación y el aprendizaje constante. Mi enfoque se centra en encontrar soluciones creativas a los desafíos del desarrollo de software, utilizando mis habilidades de resolución de problemas y mi capacidad para adaptarme a entornos cambiantes. Mi compromiso con la excelencia y la calidad me impulsa a entregar resultados sobresalientes en cada proyecto en el que participo.
          </p>

          <div className='w-full h-px mt-4 bg-gradient-to-r from-blue-900 to-transparent'></div>

          <div className='mt-10'>
            <section className='flex flex-row flex-nowrap w-full'>
              <div className='flex flex-col w-fit'>
                <div className='flex flex-row mb-2'>
                  <BriefcaseIcon className='w-10 h-auto ml-8 text-blue-900' />
                  <h2 className='flex text-blue-900 font-light mx-3 text-2xl lg:text-3xl'>
                    Experiencia Laboral
                  </h2>
                </div>
                <div className='flex flex-row'>
                  <div className='border-l-2 border-dashed border-l-blue-900 h-full w-fit ml-[3.2rem]'></div>
                  <div className='flex flex-col'>
                    <div className='my-4'>
                      <h3 className='text-blue-900 mx-3 font-medium tracking-wider text-xl lg:text-2xl'>
                        Front-end Developer
                      </h3>
                      <p className='text-red-600 text-justify mx-3 text-lg'>
                        Grupo Icarus S.A. de C.V.
                      </p>
                      <p className='text-black text-justify ml-4 mr-16'>
                        En Grupo Icarus S.A. de C.V., tuve el privilegio de formar parte de un equipo{' '}
                        <strong>integral de desarrollo</strong>. Mi rol principal fue el de <strong>frontend developer</strong>, donde
                        utilicé <strong>React.js</strong> para crear aplicaciones web modernas y atractivas. Además, también desempeñé un
                        papel importante en el área de <strong>control de calidad (QA)</strong>, donde me encargué de realizar pruebas
                        automáticas utilizando <strong>Selenium</strong>.<br /><br />
                        Como <strong>frontend developer</strong>, fui responsable de traducir los diseños y requisitos en código
                        funcional, asegurándome de que la interfaz de usuario fuera <strong>intuitiva</strong>, <strong>receptiva</strong>{' '}
                        y cumpliera con los estándares de <strong>usabilidad</strong>. Trabajé en estrecha colaboración con diseñadores y
                        otros desarrolladores para implementar nuevas funcionalidades y mejorar la experiencia del usuario.
                        <br /><br />
                        En el ámbito de <strong>QA</strong>, utilicé Selenium para desarrollar pruebas automáticas que ayudaron a
                        garantizar la <strong>calidad</strong> y <strong>estabilidad</strong> de las aplicaciones web. Realicé pruebas
                        exhaustivas para identificar y solucionar problemas antes de lanzar las aplicaciones al público.
                        <br /><br />
                        Mi experiencia en Grupo Icarus S.A. de C.V. me permitió fortalecer mis habilidades en el desarrollo frontend con{' '}
                        <strong>React.js</strong>, así como adquirir conocimientos en pruebas automáticas utilizando{' '}
                        <strong>Selenium</strong>. Estoy orgulloso de haber sido parte de un equipo talentoso y comprometido, y de haber
                        contribuido al éxito de los proyectos de la empresa.
                      </p>
                    </div>

                    <div className='my-4'>
                      <h3 className='text-blue-900 mx-3 font-medium tracking-wider text-xl lg:text-2xl'>
                        Desarrollador Web
                      </h3>
                      <p className='text-red-600 text-justify mx-3 text-lg'>
                        M&S SOLUCION S.A DE C.V
                      </p>
                      <p className='text-black text-justify ml-4 mr-16'>
                        En M&S Solucion S.A de C.V, tuve la responsabilidad de crear y gestionar su página web. Durante mi tiempo en la
                        empresa, utilicé mis habilidades en desarrollo web para diseñar y desarrollar un sitio web atractivo y funcional
                        que cumplía con los objetivos comerciales de la organización. Además, me encargué de la gestión y actualización
                        continua de la página para garantizar su rendimiento y relevancia.<br /><br />
                        A través de esta experiencia, pude fortalecer mis habilidades en diseño web y adquirir un conocimiento más
                        profundo sobre la importancia de una presencia en línea efectiva para las empresas.
                      </p>
                    </div>

                    <div className='my-4'>
                      <h3 className='text-blue-900 mx-3 font-medium tracking-wider text-xl lg:text-2xl'>
                        Freelancer Software Developer
                      </h3>
                      <p className='text-red-600 text-justify mx-3 text-lg'>
                        Fiverr
                      </p>
                      <p className='text-black text-justify ml-4 mr-16'>
                        Como freelancer en Fiverr, he ganado experiencia diversa en el campo de la tecnología y el desarrollo de software.
                        Trabajando en proyectos desafiantes, he perfeccionado mis habilidades de comunicación, gestión del tiempo y
                        satisfacción del cliente. Estoy orgulloso de haber brindado soluciones efectivas y de calidad a clientes de
                        diversas industrias y países. Busco constantemente nuevos desafíos y oportunidades para seguir creciendo
                        profesionalmente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className='flex flex-row flex-nowrap w-full'>
              <div className='flex flex-col w-fit'>
                <div className='flex flex-row mb-2'>
                  <AcademicCapIcon className='w-10 h-auto ml-8 text-red-600' />
                  <h2 className='flex text-red-600 font-light mx-3 text-2xl lg:text-3xl'>
                    Capacitación Académica
                  </h2>
                </div>
                <div className='flex flex-row'>
                  <div className='border-l-2 border-dashed border-l-red-600 h-full w-fit ml-[3.2rem]'></div>
                  <div className='flex flex-col'>
                    <div className='my-4'>
                      <h3 className='text-blue-900 mx-3 font-medium tracking-wider text-xl lg:text-2xl'>
                        Universidad Autonoma de Campeche
                      </h3>
                      <p className='text-red-600 text-justify mx-3 text-lg'>
                        Ingenieria en Tecnologia de Software
                      </p>
                    </div>
                    <div className='my-4'>
                      <h3 className='text-blue-900 mx-3 font-medium tracking-wider text-xl lg:text-2xl'>
                        Centro de Estudios Cientificos y Tecnologicos Plantel Campeche
                      </h3>
                      <p className='text-red-600 text-justify mx-3 text-lg'>
                        Especialidad en Mecatronica
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className='w-full h-px mt-4 bg-gradient-to-r from-blue-900 to-transparent'></div>

            <section className='ml-10'>
              <h2 className='flex text-blue-900 font-extralight m-3 text-2xl lg:text-3xl'>
                CURSOS
              </h2>

              <div className='flex flex-col'>
                <div className='flex flex-row w-full'>
                  <Image
                    src='/icons/simple-icons_platzi.svg'
                    alt='Platzi'
                    width={46}
                    height={46}
                    className='drop-shadow-[2px_8px_2px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest text-2xl lg:text-3xl'>
                    PLATZI
                  </p>
                </div>

                <div className='flex ml-16 mt-6'>
                  <Image
                    src='/icons/Git.svg'
                    alt='Git'
                    width={24}
                    height={24}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest'>
                    Curso profesional de Git y GitHub
                  </p>
                </div>

                <div className='flex ml-16 mt-4'>
                  <Image
                    src='/icons/Html.svg'
                    alt='HTML'
                    width={24}
                    height={24}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <Image
                    src='/icons/Css.svg'
                    alt='CSS'
                    width={24}
                    height={24}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest'>
                    Curso Practico de HTML y CSS
                  </p>
                </div>

                <div className='flex ml-16 mt-4'>
                  <Image
                    src='/icons/mdi_responsive.svg'
                    alt='Responsive'
                    width={24}
                    height={24}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest'>
                    Curso de Responsive Design: Maquetacion Mobile First
                  </p>
                </div>

                <div className='flex ml-16 mt-4'>
                  <Image
                    src='/icons/python.svg'
                    alt='Python'
                    width={24}
                    height={24}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest'>
                    Curso Basico de Python
                  </p>
                </div>
              </div>

              <div className='flex flex-col'>
                <div className='flex flex-row w-full mt-10 ml-4'>
                  <Image
                    src='/icons/udemy.svg'
                    alt='Udemy'
                    width={140}
                    height={60}
                    className='drop-shadow-[2px_4px_2px_rgba(0,0,0,0.4)]'
                  />
                </div>

                <div className='flex ml-16 mt-10'>
                  <Image
                    src='/icons/Nextjs.svg'
                    alt='Next.js'
                    width={36}
                    height={36}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest'>
                    Next.js: El framework de React para producción
                  </p>
                </div>

                <div className='flex ml-16 mt-4'>
                  <Image
                    src='/icons/React.svg'
                    alt='React'
                    width={36}
                    height={36}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest'>
                    Curso React: De cero a experto (Hooks y MERN)
                  </p>
                </div>

                <div className='flex ml-16 mt-4 mb-10'>
                  <Image
                    src='/icons/Laravel.svg'
                    alt='Laravel'
                    width={36}
                    height={36}
                    className='drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]'
                  />
                  <p className='text-blue-900 text-justify ml-2 tracking-widest'>
                    Crea un Ecommerce con Laravel, Livewire, Tailwind y Alpine
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}