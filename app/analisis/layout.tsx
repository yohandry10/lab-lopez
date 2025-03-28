import styles from './styles.module.css'

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.analysisLayout}>
      {children}
    </div>
  )
} 