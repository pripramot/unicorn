import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🤖 AI Agent Server',
    emoji: '🤖',
    description: (
      <>
        MCP-powered agent server with 13+ integrated tools for OSINT,
        web intelligence, security analysis, and forensic automation.
      </>
    ),
  },
  {
    title: '🧠 Brain & Memory',
    emoji: '🧠',
    description: (
      <>
        Advanced reasoning engine with chain-of-thought planning,
        short-term and long-term memory, and episodic experience tracking.
      </>
    ),
  },
  {
    title: '🔗 MCP A2A Protocol',
    emoji: '🔗',
    description: (
      <>
        Agent-to-Agent communication protocol enabling multi-agent
        collaboration, task delegation, and shared context across specialists.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span style={{fontSize: '4rem'}}>{emoji}</span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
