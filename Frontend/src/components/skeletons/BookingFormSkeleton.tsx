import Skeleton from 'react-loading-skeleton';

import styles from "../forms/BookingForm.module.css";

export default function BookingFormSkeleton() {
  return (
    <div className={styles.formLayout}>
      <div className={styles.header}>
        <Skeleton circle width={40} height={40} />
        <Skeleton width={220} height={32} />
      </div>

      <div className={styles.personalDetails}>
        <Skeleton height={68} />
        <Skeleton height={68} />
        <Skeleton height={68} />
      </div>

      <div className={styles.selection}>
        <Skeleton height={52} />
        <Skeleton height={52} />
        <Skeleton height={110} />
      </div>

      <div className={styles.dateTimeDetails}>
        <Skeleton height={68} />
        <Skeleton height={68} />
      </div>

      <Skeleton height={50} width="50%" borderRadius={8} />

      <div style={{ marginTop: '12px' }}>
        <Skeleton count={2} height={20} />
      </div>
    </div>
  );
}