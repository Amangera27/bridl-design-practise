import Image from "next/image";
import styles from "./HorseProfile.module.css";

export default function HorseProfile({ horse }: { horse: any }) {
  if (!horse) return null;

  return (
    <div className={styles.profileContainer}>
      {/* 1. Header & Image Strip */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Gallery</h2>
        <div className={styles.imageStrip}>
          <div className={styles.stripImageWrapper}>
             <Image src={horse.image} alt={horse.name} fill className={styles.stripImage} />
          </div>
          <div className={styles.stripImageWrapper}>
             <div className={styles.placeholderBox}>Media</div>
          </div>
          <div className={styles.stripImageWrapper}>
             <div className={styles.placeholderBox}>Media</div>
          </div>
          <div className={styles.stripImageWrapper}>
             <div className={styles.placeholderBox}>Media</div>
          </div>
        </div>
      </section>

      <div className={styles.mainGrid}>
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Category</span>
                <span className={styles.infoValue}>{horse.category}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Age</span>
                <span className={styles.infoValue}>{horse.age || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Gender</span>
                <span className={styles.infoValue}>{horse.gender || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Height</span>
                <span className={styles.infoValue}>{horse.height || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Color</span>
                <span className={styles.infoValue}>Dark Bay</span>
              </div>
            </div>
            <h3 className={styles.subTitle}>Description</h3>
            <p className={styles.paragraph}>
              This is an incredible opportunity to acquire {horse.name}. Boasting remarkable scope, intelligence, and an eagerness to learn, this {horse.gender || 'horse'} exhibits the raw talent necessary for top-tier competition.
            </p>
            <p className={styles.paragraph}>
              Carefully developed and showing tremendous potential, they have already demonstrated great capability in their training.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pedigree</h2>
            <div className={styles.pedigreeTree}>
              {/* Generation 1 */}
              <div className={styles.pedigreeCol}>
                <div className={styles.pedigreeNode}>
                  <span className={styles.pedigreeLabel}>Sire</span>
                  <span className={styles.pedigreeName}>{horse.breeding?.split('x')[0] || "Unknown"}</span>
                </div>
                <div className={styles.pedigreeNode}>
                  <span className={styles.pedigreeLabel}>Dam</span>
                  <span className={styles.pedigreeName}>{horse.breeding?.split('x')[1] || "Unknown"}</span>
                </div>
              </div>
              {/* Generation 2 */}
              <div className={styles.pedigreeCol}>
                <div className={styles.pedigreeNode}>
                  <span className={styles.pedigreeLabel}>Grandsire</span>
                  <span className={styles.pedigreeName}>Placeholder Sire</span>
                </div>
                <div className={styles.pedigreeNode}>
                  <span className={styles.pedigreeLabel}>Granddam</span>
                  <span className={styles.pedigreeName}>Placeholder Dam</span>
                </div>
                 <div className={styles.pedigreeNode}>
                  <span className={styles.pedigreeLabel}>Grandsire</span>
                  <span className={styles.pedigreeName}>Placeholder Sire 2</span>
                </div>
                <div className={styles.pedigreeNode}>
                  <span className={styles.pedigreeLabel}>Granddam</span>
                  <span className={styles.pedigreeName}>Placeholder Dam 2</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
           <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Performance</h2>
            
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressHeader}>
                <span>Scope & Power</span>
                <span>90%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '90%'}}></div></div>
            </div>

            <div className={styles.progressBarWrapper}>
              <div className={styles.progressHeader}>
                <span>Technique</span>
                <span>85%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '85%'}}></div></div>
            </div>

            <div className={styles.progressBarWrapper}>
              <div className={styles.progressHeader}>
                <span>Rideability</span>
                <span>80%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '80%'}}></div></div>
            </div>
            
             <div className={styles.progressBarWrapper}>
              <div className={styles.progressHeader}>
                <span>Carefulness</span>
                <span>95%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '95%'}}></div></div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Competition Summary</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2023</div>
                <div className={styles.timelineContent}>
                  <strong>1st Place - CSI2* Grand Prix</strong>
                  <p>Clear round, fastest jump-off.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2022</div>
                <div className={styles.timelineContent}>
                  <strong>Top 10 - National Championship</strong>
                  <p>Consistent performance throughout the season.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* FULL WIDTH MAP SECTION */}
      <section className={styles.section}>
         <h2 className={styles.sectionTitle}>Location</h2>
         <div className={styles.mapContainer}>
           <div className={styles.mapPlaceholder}>
              Interactive Map Interface <br/> {horse.country}
           </div>
         </div>
      </section>

      {/* FOOTER - RELATED HORSES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Other Horses You Might Like</h2>
        <div className={styles.relatedGrid}>
          {[1,2,3,4].map(i => (
            <div key={i} className={styles.relatedCard}>
              <div className={styles.relatedImage}></div>
              <div className={styles.relatedInfo}>
                <h4>Similar Horse {i}</h4>
                <span>Show Jumping • €45k</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
