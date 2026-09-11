import { useTranslations } from 'next-intl'

import styles from './Loading.module.css'

export const Loading = ({ pluralName }: { pluralName: string }) => {
  const t = useTranslations('select-location')

  return (
    <div>
      <span className="ams-visually-hidden">{t('assets-loading', { pluralName })}</span>
      <div className={styles.container}>
        <div className={styles.loading} />
      </div>
      <div className={styles.container}>
        <div className={styles.loading} />
      </div>
      <div className={styles.container}>
        <div className={styles.loading} />
      </div>
    </div>
  )
}
