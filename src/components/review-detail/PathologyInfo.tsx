interface PathologyInfoProps {
  patologiaName: string;
}

export const PathologyInfo = ({ patologiaName }: PathologyInfoProps) => {
  return (
    <div className="mt-12 space-y-6 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900">{patologiaName}</h2>
      <p className="text-gray-700">
        Scopri l'esperienza di chi soffre di {patologiaName} grazie alle recensioni ed esperienze di altri utenti.
      </p>
      <p className="text-gray-700">
        Su StoMale.info puoi leggere le esperienze di utenti che hanno o hanno avuto a che fare con questa patologia. 
        Puoi leggere le loro esperienze, commentarle o fare domande e scoprire quali sintomi ha o come si sta curando chi soffre di {patologiaName}. 
        Puoi inoltre confrontarti su esperti e cure, chiedendo anche di effetti positivi oppure effetti collaterali o reazioni, 
        tenendo però presente che si tratta di esperienze individuali e che quindi bisognerà sempre rivolgersi al proprio medico curante per diagnosi e cura.
      </p>
      <p className="text-gray-700">
        Leggi le esperienze degli utenti che soffrono di {patologiaName} e scopri come stanno.
      </p>
      <p className="text-gray-600 text-sm mt-8">
        Gli utenti scrivono recensioni basate sulla propria esperienza personale e sotto diagnosi e consiglio medico, 
        questo sito quindi NON è inteso per consulenza medica, diagnosi o trattamento e NON deve in nessun caso sostituirsi 
        a un consulto medico, una visita specialistica o altro. StoMale.info e DigiConsulting non si assumono responsabilità 
        sulla libera interpretazione del contenuto scritto da altri utenti. E' doveroso contattare il proprio medico e/o specialista 
        per la diagnosi di malattie e per la prescrizione e assunzione di farmaci.
      </p>
    </div>
  );
};